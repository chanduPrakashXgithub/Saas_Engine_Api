import { verfy_token } from "../utils/jwt";
export const auth_middlewaare=(roles=[])=>{
    return (req,res,next)=>{
        const authHeader = req.headers.authorization;
        if(!authHeader||authHeader.split(" ")[0]!=="Bearer"){
            return res.status(401).json({message:"Unauthorized"});
        }
        const token = authHeader.split(" ")[1];
        try{
            const decoded = verfy_token(token);
            req.user=decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }
            next();
        } catch {
            return res.status(401).json({ error: "Invalid token" });
        }
    }
}