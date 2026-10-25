import { createAttribute, deleteAttribute, getAttributeById, updateAttribute  } from "../repositories/attributeRepository.js";

export const createUseAttributeService = async (attribute) => {
    return await createAttribute(attribute);
};

export const updateAttributeService = async (atr_codigo, updateData) => {
    return await updateAttribute(atr_codigo, updateData);
};

export const deleteAttributeService = async (atr_codigo) => {
    return await deleteAttribute(atr_codigo);
};

export const getAttributeByIdService = async (atr_codigo) => {
    return await getAttributeById(atr_codigo);
};