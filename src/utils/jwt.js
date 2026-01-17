import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "change-me-in-production";
const EXPIRES_IN = '1h';

export const sign_token = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
};

export const verfy_token = (token) => {
    return jwt.verify(token, SECRET_KEY);
};