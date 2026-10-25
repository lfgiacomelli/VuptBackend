import { createMotorcycle, deleteMotorcycle, getMotorcycleById, updateUser, getAllMotorcycles } from "../repositories/motorcycleRepository.js";

export const createMotorcycleService = async (motorcycle) => {
    return await createMotorcycle(motorcycle);
};

export const updateMotorcycleService = async (moto_codigo, updateData) => {
    return await updateUser(moto_codigo, updateData);
};

export const deleteMotorcycleService = async (moto_codigo) => {
    return await deleteMotorcycle(moto_codigo);
};

export const getMotorcycleByIdService = async (moto_codigo) => {
    return await getMotorcycleById(moto_codigo);
};

export const getAllMotorcyclesService = async (ate_codigo) => {
    return await getAllMotorcycles(ate_codigo);
}