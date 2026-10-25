import { createAttendant, updateAttendant, deleteAttendant, getAttendantById, getAttendantsByCompany } from "../repositories/attendantRepository.js";

export const createAttendantService = async (attendant) => {
    const hashedPassword = await bcrypt.hash(attendant.ate_senha, 10);

    const attendantData = {
        ...attendant,
        ate_senha: hashedPassword,
        ate_created_at: new Date(),
        ate_updated_at: new Date()
    }
    return await createAttendant(attendantData);
};

export const updateAttendantService = async (ate_codigo, updateData) => {
    if (updateData.ate_senha) {
        const hashedPassword = await bcrypt.hash(updateData.ate_senha, 10);
        updateData.ate_senha = hashedPassword;
    }
    return await updateAttendant(ate_codigo, updateData);
};

export const deleteAttendantService = async (ate_codigo) => {
    return await deleteAttendant(ate_codigo);
};

export const getAttendantByIdService = async (ate_codigo) => {
    return await getAttendantById(ate_codigo);
};

export const getAttendantsByCompanyService = async (emp_codigo) => {
    return await getAttendantsByCompany(emp_codigo);
}