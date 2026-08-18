#!/usr/bin/env python3
"""
Backend API Testing Script for Order Management System
Tests all Order endpoints and regression checks for existing endpoints
"""

import requests
import json
from datetime import datetime
import re

# Backend URL from environment
BACKEND_URL = "https://wellness-center-87.preview.emergentagent.com/api"

def print_test_header(test_name):
    """Print formatted test header"""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(passed, message):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {message}")

def test_regression_endpoints():
    """Test existing endpoints to ensure they still work"""
    print_test_header("REGRESSION: GET /api/")
    
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                print_result(True, f"Root endpoint working: {data}")
                return True
            else:
                print_result(False, f"Unexpected response format: {data}")
                return False
        else:
            print_result(False, f"Status code {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_status_endpoint():
    """Test status endpoint"""
    print_test_header("REGRESSION: GET /api/status")
    
    try:
        response = requests.get(f"{BACKEND_URL}/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"Status endpoint working, returned {len(data)} items")
            return True
        else:
            print_result(False, f"Status code {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_create_order_valid():
    """Test POST /api/orders with valid payload"""
    print_test_header("POST /api/orders - Valid Payload")
    
    payload = {
        "customer_name": "Budi Santoso",
        "phone": "081234567890",
        "address": "Jl. Merdeka No. 10, Jakarta Pusat, 10110",
        "notes": "Kirim pagi",
        "items": [
            {
                "product_id": "p1",
                "name": "LIXIANA 60 mg",
                "price": 1100000,
                "quantity": 2
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/orders",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Verify all required fields
            checks = []
            
            # Check invoice pattern
            invoice_pattern = r"^INV-\d{8}-\d{4}$"
            if "invoice" in data and re.match(invoice_pattern, data["invoice"]):
                checks.append(("invoice pattern", True, f"Valid: {data['invoice']}"))
            else:
                checks.append(("invoice pattern", False, f"Invalid: {data.get('invoice', 'MISSING')}"))
            
            # Check total
            expected_total = 2200000
            if data.get("total") == expected_total:
                checks.append(("total", True, f"Correct: {data['total']}"))
            else:
                checks.append(("total", False, f"Expected {expected_total}, got {data.get('total')}"))
            
            # Check status
            if data.get("status") == "pending":
                checks.append(("status", True, "Correct: pending"))
            else:
                checks.append(("status", False, f"Expected 'pending', got {data.get('status')}"))
            
            # Check id (UUID)
            if "id" in data and len(data["id"]) > 0:
                checks.append(("id", True, f"Present: {data['id']}"))
            else:
                checks.append(("id", False, "Missing or empty"))
            
            # Check created_at
            if "created_at" in data:
                try:
                    # Try to parse as datetime
                    datetime.fromisoformat(data["created_at"].replace('Z', '+00:00'))
                    checks.append(("created_at", True, f"Valid: {data['created_at']}"))
                except (ValueError, AttributeError) as e:
                    checks.append(("created_at", False, f"Invalid format: {data['created_at']}"))
            else:
                checks.append(("created_at", False, "Missing"))
            
            # Print all checks
            all_passed = True
            for field, passed, msg in checks:
                print_result(passed, f"{field}: {msg}")
                if not passed:
                    all_passed = False
            
            if all_passed:
                print_result(True, "All validations passed")
                return data  # Return the created order for subsequent tests
            else:
                print_result(False, "Some validations failed")
                return None
        else:
            print_result(False, f"Status code {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return None

def test_get_order_by_invoice(invoice):
    """Test GET /api/orders/{invoice}"""
    print_test_header(f"GET /api/orders/{invoice}")
    
    try:
        response = requests.get(f"{BACKEND_URL}/orders/{invoice}", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if data.get("invoice") == invoice:
                print_result(True, f"Order retrieved successfully with matching invoice")
                return True
            else:
                print_result(False, f"Invoice mismatch: expected {invoice}, got {data.get('invoice')}")
                return False
        else:
            print_result(False, f"Status code {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_get_order_not_found():
    """Test GET /api/orders with non-existent invoice (should 404)"""
    print_test_header("GET /api/orders/INV-99999999-9999 - Should 404")
    
    try:
        response = requests.get(f"{BACKEND_URL}/orders/INV-99999999-9999", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print_result(True, "Correctly returned 404 for non-existent order")
            return True
        else:
            print_result(False, f"Expected 404, got {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_list_orders():
    """Test GET /api/orders - list all orders"""
    print_test_header("GET /api/orders - List Orders")
    
    try:
        response = requests.get(f"{BACKEND_URL}/orders", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: Retrieved {len(data)} orders")
            
            if isinstance(data, list):
                if len(data) <= 50:
                    print_result(True, f"List endpoint working, returned {len(data)} orders (limit 50)")
                    
                    # Check if our created order is in the list
                    if len(data) > 0:
                        print(f"Sample order: {json.dumps(data[0], indent=2)}")
                    return True
                else:
                    print_result(False, f"Returned {len(data)} orders, exceeds limit of 50")
                    return False
            else:
                print_result(False, f"Expected list, got {type(data)}")
                return False
        else:
            print_result(False, f"Status code {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_create_order_missing_customer_name():
    """Test POST /api/orders with missing customer_name (should 422)"""
    print_test_header("POST /api/orders - Missing customer_name (Should 422)")
    
    payload = {
        "phone": "081234567890",
        "address": "Jl. Merdeka No. 10, Jakarta Pusat, 10110",
        "items": [
            {
                "product_id": "p1",
                "name": "LIXIANA 60 mg",
                "price": 1100000,
                "quantity": 2
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/orders",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 422:
            print_result(True, "Correctly returned 422 for missing customer_name")
            print(f"Error details: {response.text}")
            return True
        else:
            print_result(False, f"Expected 422, got {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_create_order_empty_items():
    """Test POST /api/orders with empty items list (should 422)"""
    print_test_header("POST /api/orders - Empty items list (Should 422)")
    
    payload = {
        "customer_name": "Budi Santoso",
        "phone": "081234567890",
        "address": "Jl. Merdeka No. 10, Jakarta Pusat, 10110",
        "items": []
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/orders",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 422:
            print_result(True, "Correctly returned 422 for empty items list")
            print(f"Error details: {response.text}")
            return True
        else:
            print_result(False, f"Expected 422, got {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("BACKEND API TESTING - ORDER MANAGEMENT SYSTEM")
    print("="*80)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    results = {}
    
    # Regression tests
    results["regression_root"] = test_regression_endpoints()
    results["regression_status"] = test_status_endpoint()
    
    # Order creation with valid payload
    created_order = test_create_order_valid()
    results["create_order_valid"] = created_order is not None
    
    # Get order by invoice (if creation succeeded)
    if created_order and "invoice" in created_order:
        results["get_order_by_invoice"] = test_get_order_by_invoice(created_order["invoice"])
    else:
        print_test_header("GET /api/orders/{invoice} - SKIPPED")
        print_result(False, "Skipped because order creation failed")
        results["get_order_by_invoice"] = False
    
    # Get non-existent order (should 404)
    results["get_order_not_found"] = test_get_order_not_found()
    
    # List all orders
    results["list_orders"] = test_list_orders()
    
    # Validation tests
    results["missing_customer_name"] = test_create_order_missing_customer_name()
    results["empty_items"] = test_create_order_empty_items()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} TEST(S) FAILED")
        return 1

if __name__ == "__main__":
    exit(main())
