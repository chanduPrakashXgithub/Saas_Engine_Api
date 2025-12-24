import {prisma} from "../../config/prisma.js";
export const createUser = async({tenantId,email,password,role})=>{
    return prisma.user.create({
        data:{
            email,
            password,
            role,
            tenantId
        }
    })
}
export const listUsers=async(tenantId)=>{
    return prisma.user.findMany({
        where:{tenantId},
    })
}