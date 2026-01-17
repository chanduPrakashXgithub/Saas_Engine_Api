import { prisma } from "../../config/prisma.js";
import bcrypt from "bcrypt";

export const createUser = async ({ tenantId, email, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            tenantId,
        },
    });
};

export const listUsers = async (tenantId) => {
    return prisma.user.findMany({
        where: { tenantId },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
};

export const resetPassword = async (userId, tenantId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
        where: { id: userId, tenantId },
        data: { password: hashedPassword },
    });
};