import {
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById,
    getAddressesByUser
} from "../repositories/addressRepository.js";

export const createAddressService = async (address) => {
    return await createAddress(address);
};

export const updateAddressService = async (end_codigo, updateData) => {
    return await updateAddress(end_codigo, updateData);
};

export const deleteAddressService = async (end_codigo) => {
    return await deleteAddress(end_codigo);
};

export const getAddressByIdService = async (end_codigo) => {
    return await getAddressById(end_codigo);
};

export const getAddressesByUserService = async (usu_codigo) => {
    return await getAddressesByUser(usu_codigo);
};