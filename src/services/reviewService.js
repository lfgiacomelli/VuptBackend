import { getAvailablesByUser, createAvailable, getAvailablesToExplain } from "../repositories/reviewRepository.js";

export const getAvailablesByUserService = async (usu_codigo) => {
    return await getAvailablesByUser(usu_codigo);
};

export const createAvailableService = async (available) => {
    return await createAvailable({
        ...available,
        created_at: new Date(),
        updated_at: new Date()
    });
};

export const getAvailablesToExplainService = async () => {
    return await getAvailablesToExplain();
}