import { asyncHandler } from "../../utils/asyncHandler.js";
import * as userService from "./user.service.js";
export const createUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    const user = await userService.createUser({
        tenantId: req.tenantId,
        email: email,
        password, role
    });
    res.status(201).json({
        user
    })
})
export const listUsers = asyncHandler(async (req, res) => {
    const users = await userService.listUsers(req.tenantId);
    res.status(200).json({
        users
    })
})

export const resetPassword = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;
    await userService.resetPassword(userId, req.tenantId, newPassword);
    res.status(200).json({ message: "Password reset successfully" });
})