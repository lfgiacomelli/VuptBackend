import { cancelRequest, createRequest, getRequestById, getRequestsByUser, getTravelIdByRequestId, acceptRequest, getRequests, refuseRequest } from "../repositories/requestRepository.js";

export const createRequestService = async (request) => {
    return await createRequest(request);
}

export const getRequestByIdService = async (sol_codigo) => {
    return await getRequestById(sol_codigo);
}

export const getRequestsByUserService = async (usu_codigo) => {
    return await getRequestsByUser(usu_codigo);
}

export const cancelRequestService = async (sol_codigo) => {
    return await cancelRequest(sol_codigo);
}

export const getTravelIdByRequestIdService = async (sol_codigo) => {
    return await getTravelIdByRequestId(sol_codigo);
}

export const getRequestsService = async (ate_codigo) => {
    return await getRequests(ate_codigo);
};

export const acceptRequestService = async (sol_codigo, mot_codigo, ate_codigo) => {
    if (!sol_codigo || !mot_codigo || !ate_codigo) {
        throw new Error("Dados obrigatórios não informados");
    }

    return await acceptRequest(sol_codigo, mot_codigo, ate_codigo);
};

export const refuseRequestService = async (sol_codigo) => {
    return await refuseRequest(sol_codigo);
};
