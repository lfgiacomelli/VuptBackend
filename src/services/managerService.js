import bcrypt from "bcrypt";

import { createManager, deleteManager, getManagerById, updateManager, getManagers } from "../repositories/managerRepository.js";

export const createManagerService = async (manager) => {
    const hashedPassword = await bcrypt.hash(manager.ges_senha, 10);

    const managerData = {
        ...manager,
        ges_senha: hashedPassword,
        ges_created_at: new Date(),
        ges_updated_at: new Date()
    }
    return await createManager(managerData);
};

export const updateManagerService = async (ges_codigo, updateData) => {
    if (updateData.ges_senha) {
        const hashedPassword = await bcrypt.hash(updateData.ges_senha, 10);
        updateData.ges_senha = hashedPassword;
    }
    return await updateManager(ges_codigo, updateData);
};

export const deleteManagerService = async (ges_codigo) => {
    return await deleteManager(ges_codigo);
};

export const getManagerByIdService = async (ges_codigo) => {
    return await getManagerById(ges_codigo);
};
export const getManagersService = async () => {
    return await getManagers();
};




