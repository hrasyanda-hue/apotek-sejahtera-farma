// Mock customer reviews per product id (falls back to default if missing)
const defaultReviews = [
  { name: 'Rina W.', rating: 5, date: '2 minggu lalu', comment: 'Produk asli, pengemasan aman dan rapi. Pengiriman cepat sampai ke Bekasi. Recommended!' },
  { name: 'Andi P.', rating: 5, date: '1 bulan lalu', comment: 'Harga bersaing dibanding apotek lain. Admin fast response di WhatsApp, sangat membantu.' },
  { name: 'Siti K.', rating: 4, date: '3 minggu lalu', comment: 'Barang sesuai deskripsi. Semoga stoknya selalu tersedia ya.' },
];

const specific = {
  p1: [
    { name: 'dr. Hendra', rating: 5, date: '1 minggu lalu', comment: 'Sesuai resep, expired date masih panjang. Terima kasih.' },
    { name: 'Bapak Yusuf', rating: 5, date: '2 minggu lalu', comment: 'Sudah 3 kali order Lixiana di sini, selalu original dan tepat waktu.' },
  ],
  p4: [
    { name: 'Melinda', rating: 4, date: '5 hari lalu', comment: 'Xenical original, kemasan segel utuh. Sedikit lama proses tapi worth it.' },
  ],
  i1: [
    { name: 'Pak Wahyu', rating: 5, date: '3 hari lalu', comment: 'NovoRapid dikirim pakai ice pack, dingin sampai tujuan. Aman untuk insulin.' },
    { name: 'Ibu Rani', rating: 5, date: '2 minggu lalu', comment: 'Untuk kebutuhan ayah saya diabetes. Admin ramah dan sabar menjawab.' },
  ],
  i13: [
    { name: 'Ferry S.', rating: 5, date: '1 minggu lalu', comment: 'Wegovy asli Novo Nordisk, kemasan lengkap. Sudah efek nurunin nafsu makan.' },
  ],
  a1: [
    { name: 'Ibu Dewi', rating: 5, date: '4 hari lalu', comment: 'Symbicort turbuhaler original dan sesuai dosis. Sangat membantu asma anak.' },
    { name: 'Rizky A.', rating: 4, date: '2 minggu lalu', comment: 'Kualitas oke, sama seperti beli di apotek besar.' },
  ],
};

export function getReviews(productId) {
  return specific[productId] || defaultReviews;
}

export const overallStats = {
  averageRating: 4.9,
  totalReviews: 1284,
  distribution: [
    { stars: 5, percent: 91 },
    { stars: 4, percent: 7 },
    { stars: 3, percent: 1 },
    { stars: 2, percent: 0.5 },
    { stars: 1, percent: 0.5 },
  ],
};

export const featuredTestimonials = [
  { name: 'Bapak Yusuf', location: 'Jakarta Timur', rating: 5, avatar: 'BY', comment: 'Sudah langganan sejak 2 tahun lalu. Selalu original, harga bersahabat, dan admin sangat responsif. Pengiriman ke rumah selalu tepat waktu.' },
  { name: 'Ibu Rina W.', location: 'Bekasi', rating: 5, avatar: 'RW', comment: 'Beli obat rutin untuk orang tua di sini karena stok lengkap dan bisa nego. Kemasan selalu rapi dan aman meski dikirim jauh.' },
  { name: 'dr. Hendra', location: 'Bogor', rating: 5, avatar: 'DH', comment: 'Sebagai tenaga medis saya butuh sumber obat resep yang terpercaya. Apotek Mediva selalu memberikan produk original dengan tanggal kedaluwarsa panjang.' },
  { name: 'Ibu Dewi', location: 'Depok', rating: 5, avatar: 'ID', comment: 'Inhaler asma anak saya dikirim dalam 1 hari. Segel utuh dan sesuai pesanan. Sangat terbantu, terima kasih Apotek Mediva!' },
  { name: 'Pak Wahyu', location: 'Tangerang', rating: 5, avatar: 'PW', comment: 'Insulin dikirim dengan ice pack sehingga tetap dingin sampai tujuan. Perlakuan khusus untuk obat cold chain benar-benar diperhatikan.' },
  { name: 'Melinda', location: 'Jakarta Selatan', rating: 4, avatar: 'M', comment: 'Harga cukup bersaing dan pilihan obatnya banyak. Admin membantu konsultasi terkait ketersediaan stok.' },
];
