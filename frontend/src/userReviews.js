// Manage user-submitted reviews in localStorage
const KEY = 'mediva_user_reviews_v1';

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    // Storage may be full (photos too large). Try again without photos
    try {
      const stripped = {};
      Object.keys(data).forEach((k) => {
        stripped[k] = data[k].map(({ photo, ...rest }) => rest);
      });
      localStorage.setItem(KEY, JSON.stringify(stripped));
    } catch (_) { /* give up */ }
  }
}

export function getUserReviews(productId) {
  const all = readAll();
  return all[productId] || [];
}

export function addUserReview(productId, review) {
  const all = readAll();
  const list = all[productId] || [];
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: review.name.trim(),
    rating: Number(review.rating) || 5,
    comment: review.comment.trim(),
    photo: review.photo || null,
    date: 'Baru saja',
    createdAt: Date.now(),
    isUser: true,
  };
  all[productId] = [entry, ...list];
  writeAll(all);
  return entry;
}

export function deleteUserReview(productId, reviewId) {
  const all = readAll();
  const list = all[productId] || [];
  all[productId] = list.filter((r) => r.id !== reviewId);
  writeAll(all);
}
