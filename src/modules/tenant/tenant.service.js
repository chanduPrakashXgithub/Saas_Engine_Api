import {prisma} from '../../config/prisma.js';
export const createTenant = async({name})=>{
    return await prisma.tenant.create({
        data:{name}
    });
};

export const getTenants = async()=>{
    return await prisma.tenant.findMany();
};