import { createUser, updateUser, deleteUser, getUserById, getAllUsers } from "../repositories/userRepository.js";

import bcrypt from "bcrypt";

export const createUserService = async (user) => {
    const hashedPassword = await bcrypt.hash(user.usu_senha, 10);

    const userData = {
        ...user,
        usu_senha: hashedPassword,
        usu_created_at: new Date(),
        usu_updated_at: new Date()
    }
    return await createUser(userData);
};

export const updateUserService = async (usu_codigo, updateData) => {
    if (updateData.usu_senha) {
        const hashedPassword = await bcrypt.hash(updateData.usu_senha, 10);
        updateData.usu_senha = hashedPassword;
    }
    return await updateUser(usu_codigo, updateData);
};

export const deleteUserService = async (usu_codigo) => {
    return await deleteUser(usu_codigo);
};

export const getUserByIdService = async (usu_codigo) => {
    return await getUserById(usu_codigo);
};
export const getAllUsersService = async () => {
    return await getAllUsers();
}