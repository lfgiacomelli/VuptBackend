import {
    createSupport,
    getSupportById,
    getSupportsByUser,
    getOpenSupportByUserAndCompany,
    cancelSupportByUser,
    getSupportsByCompany,
    getOpenSupportsByCompany,
    getSupportsInAttendanceByAttendant,
    acceptSupport,
    finishSupport,
    cancelSupportByAttendant,
    updateSupportDetails,
    deleteSupport,
    getSupportsByStatusAndCompany,
    getSupportsCountByCompany,
    getAvailablesTravelsToSupport
} from "../repositories/supportRepository.js";

export const createSupportService = async (supportData) => {
    const {
        emp_codigo,
        usu_codigo,
        via_codigo,
        sup_motivo,
        sup_descricao
    } = supportData;

    if (!emp_codigo) {
        throw new Error("O código da empresa é obrigatório");
    }

    if (!usu_codigo) {
        throw new Error("O código do usuário é obrigatório");
    }

    if (!via_codigo) {
        throw new Error("O código da viagem é obrigatório");
    }

    if (!sup_motivo || !sup_motivo.trim()) {
        throw new Error("O motivo do chamado é obrigatório");
    }

    return await createSupport({
        emp_codigo,
        usu_codigo,
        via_codigo,
        sup_motivo: sup_motivo.trim(),
        sup_descricao: sup_descricao?.trim() || null
    });
};

export const getSupportByIdService = async (sup_codigo) => {
    if (!sup_codigo) {
        throw new Error("O código do chamado é obrigatório");
    }

    return await getSupportById(sup_codigo);
};

export const getSupportsByUserService = async (usu_codigo) => {
    if (!usu_codigo) {
        throw new Error("O código do usuário é obrigatório");
    }

    return await getSupportsByUser(usu_codigo);
};

export const getOpenSupportByUserAndCompanyService = async (usu_codigo, emp_codigo) => {
    if (!usu_codigo) {
        throw new Error("O código do usuário é obrigatório");
    }

    if (!emp_codigo) {
        throw new Error("O código da empresa é obrigatório");
    }

    return await getOpenSupportByUserAndCompany(usu_codigo, emp_codigo);
};

export const cancelSupportByUserService = async (sup_codigo, usu_codigo) => {
    if (!sup_codigo) {
        throw new Error("O código do chamado é obrigatório");
    }

    if (!usu_codigo) {
        throw new Error("O código do usuário é obrigatório");
    }

    return await cancelSupportByUser(sup_codigo, usu_codigo);
};

export const updateSupportDetailsService = async (sup_codigo, updateData) => {
    if (!sup_codigo) {
        throw new Error("O código do chamado é obrigatório");
    }

    const hasValidField =
        updateData?.sup_motivo !== undefined ||
        updateData?.sup_descricao !== undefined;

    if (!hasValidField) {
        throw new Error("Nenhum dado válido foi enviado para atualização");
    }

    if (updateData.sup_motivo !== undefined && !String(updateData.sup_motivo).trim()) {
        throw new Error("O motivo do chamado não pode ser vazio");
    }

    if (updateData.sup_motivo !== undefined) {
        updateData.sup_motivo = String(updateData.sup_motivo).trim();
    }

    if (updateData.sup_descricao !== undefined) {
        updateData.sup_descricao = updateData.sup_descricao
            ? String(updateData.sup_descricao).trim()
            : null;
    }

    return await updateSupportDetails(sup_codigo, updateData);
};

export const getSupportsByCompanyService = async (emp_codigo) => {
    if (!emp_codigo) {
        throw new Error("O código da empresa é obrigatório");
    }

    return await getSupportsByCompany(emp_codigo);
};

export const getOpenSupportsByCompanyService = async (emp_codigo) => {
    if (!emp_codigo) {
        throw new Error("O código da empresa é obrigatório");
    }

    return await getOpenSupportsByCompany(emp_codigo);
};

export const getSupportsInAttendanceByAttendantService = async (ate_codigo) => {
    if (!ate_codigo) {
        throw new Error("O código do atendente é obrigatório");
    }

    return await getSupportsInAttendanceByAttendant(ate_codigo);
};

export const getAvailablesTravelsToSupportService = async (usu_codigo) => {
    if (!usu_codigo) {
        throw new Error("O código do usuário é obrigatório");
    }
    return await getAvailablesTravelsToSupport(usu_codigo);
};

export const acceptSupportService = async (sup_codigo, ate_codigo) => {
    if (!sup_codigo) {
        throw new Error("O código do chamado é obrigatório");
    }

    if (!ate_codigo) {
        throw new Error("O código do atendente é obrigatório");
    }

    return await acceptSupport(sup_codigo, ate_codigo);
};

export const finishSupportService = async (sup_codigo, ate_codigo) => {
    if (!sup_codigo) {
        throw new Error("O código do chamado é obrigatório");
    }

    if (!ate_codigo) {
        throw new Error("O código do atendente é obrigatório");
    }

    return await finishSupport(sup_codigo, ate_codigo);
};

export const cancelSupportByAttendantService = async (sup_codigo, ate_codigo) => {
    if (!sup_codigo) {
        throw new Error("O código do chamado é obrigatório");
    }

    if (!ate_codigo) {
        throw new Error("O código do atendente é obrigatório");
    }

    return await cancelSupportByAttendant(sup_codigo, ate_codigo);
};

export const getSupportsByStatusAndCompanyService = async (emp_codigo, sup_status) => {
    const allowedStatus = ["aberto", "em_atendimento", "finalizado", "cancelado"];

    if (!emp_codigo) {
        throw new Error("O código da empresa é obrigatório");
    }

    if (!sup_status) {
        throw new Error("O status do chamado é obrigatório");
    }

    if (!allowedStatus.includes(sup_status)) {
        throw new Error("Status de chamado inválido");
    }

    return await getSupportsByStatusAndCompany(emp_codigo, sup_status);
};

export const getSupportsCountByCompanyService = async (emp_codigo) => {
    if (!emp_codigo) {
        throw new Error("O código da empresa é obrigatório");
    }

    return await getSupportsCountByCompany(emp_codigo);
};

export const deleteSupportService = async (sup_codigo) => {
    if (!sup_codigo) {
        throw new Error("O código do chamado é obrigatório");
    }

    return await deleteSupport(sup_codigo);
};