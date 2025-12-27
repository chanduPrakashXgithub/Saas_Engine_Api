import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "FuckkkYouuNiggaa";
const EXPIRES_IN = '1h';
export const sign_token=(payload)=>{
     jwt.sign(payload,SECRET_KEY,{expiresIn:EXPIRES_IN});
}
export const verfy_token=(token)=>{
    jwt.verify(token,SECRET_KEY);
}