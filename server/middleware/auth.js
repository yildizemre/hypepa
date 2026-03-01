import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hype-vision-dev-secret-en-az-32-karakter-olmali';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token gerekli.' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token.' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Bu işlem için yönetici yetkisi gerekli.' });
  }
  next();
}

export function getJWTSecret() {
  return JWT_SECRET;
}
