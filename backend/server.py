from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import random
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ---------- ORDER MODELS ----------
class OrderItem(BaseModel):
    product_id: str
    name: str
    price: int
    quantity: int = 1


class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=80)
    phone: str = Field(..., min_length=6, max_length=25)
    address: str = Field(..., min_length=5, max_length=400)
    notes: Optional[str] = Field(None, max_length=500)
    items: List[OrderItem] = Field(..., min_length=1)


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    invoice: str
    customer_name: str
    phone: str
    address: str
    notes: Optional[str] = None
    items: List[OrderItem]
    total: int
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


async def _generate_invoice() -> str:
    """Generate invoice number like INV-YYYYMMDD-XXXX (retry on collision)."""
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    for _ in range(10):
        suffix = f"{random.randint(0, 9999):04d}"
        candidate = f"INV-{today}-{suffix}"
        existing = await db.orders.find_one({"invoice": candidate}, {"_id": 1})
        if not existing:
            return candidate
    # Fallback with longer suffix
    return f"INV-{today}-{uuid.uuid4().hex[:6].upper()}"


@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    invoice = await _generate_invoice()
    total = sum(item.price * item.quantity for item in payload.items)
    order = Order(
        invoice=invoice,
        customer_name=payload.customer_name.strip(),
        phone=payload.phone.strip(),
        address=payload.address.strip(),
        notes=(payload.notes or "").strip() or None,
        items=payload.items,
        total=total,
    )
    doc = order.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.orders.insert_one(doc)
    logger.info(f"New order created: {invoice} - Rp {total:,}")
    return order


@api_router.get("/orders/{invoice}", response_model=Order)
async def get_order(invoice: str):
    doc = await db.orders.find_one({"invoice": invoice}, {"_id": 0})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")
    if isinstance(doc.get("created_at"), str):
        doc["created_at"] = datetime.fromisoformat(doc["created_at"])
    return doc


@api_router.get("/orders", response_model=List[Order])
async def list_orders(limit: int = 50):
    docs = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return docs


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()