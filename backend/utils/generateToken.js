const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, customerId) => {
  const secret = process.env.JWT_SECRET || 'shopkart_super_secret_jwt_key_2026_xyz';
  const token = jwt.sign({ id: customerId }, secret, {
    expiresIn: '7d'
  });

  if (res && res.cookie) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  return token;
};

module.exports = generateTokenAndSetCookie;
