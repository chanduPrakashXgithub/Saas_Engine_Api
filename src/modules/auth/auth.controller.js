import { prisma } from "../../config/prisma.js";
import {sign_token,verfy_token} from '../../utils/jwt.js';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../../utils/asyncHandler.js';
export const login = asyncHandler(async(req , res)=>{
    const {email , password}=req.body;
    const user = await prisma.user.findUnique({where:{email}});
    if(!user){
        return res.status(401).json({message:"Invalid email or password"});
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({message:"Invalid email or password"});
    }
    const token = sign_token({id:user.id,email:user.email,role:user.role});
    res.json({token});
})