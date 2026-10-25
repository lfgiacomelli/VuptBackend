import {
    createSupportMessage,
    getSupportMessagesBySupport,
    getSupportMessageById,
    markSupportMessagesAsRead
} from "../repositories/supportMessageRepository.js";

import { getSupportById } from "../repositories/supportRepository.js";

export const createSupportMessageService = async (messageData) => {
    const {
        sup_codigo,
        remetente_tipo,
        remetente_codigo,
        msg_texto
    } = messageData;

    if (!sup_codigo || !remetente_tipo || !msg_texto?.trim()) {
        throw new Error("Campos obrigatórios não informados.");
    }

    const support = await getSupportById(sup_codigo);

    if (!support) {
        throw new Error("Chamado não encontrado.");
    }

    if (support.sup_status === "finalizado" || support.sup_status === "cancelado") {
        throw new Error("Este chamado não aceita novas mensagens.");
    }

    return await createSupportMessage({
        sup_codigo,
        remetente_tipo,
        remetente_codigo,
        msg_texto: msg_texto.trim()
    });
};

export const getSupportMessagesBySupportService = async (sup_codigo) => {
    return await getSupportMessagesBySupport(sup_codigo);
};

export const getSupportMessageByIdService = async (msg_codigo) => {
    return await getSupportMessageById(msg_codigo);
};

export const markSupportMessagesAsReadService = async (sup_codigo, remetente_tipo) => {
    return await markSupportMessagesAsRead(sup_codigo, remetente_tipo);
};