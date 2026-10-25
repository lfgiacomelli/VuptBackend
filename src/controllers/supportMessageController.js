import {
    createSupportMessageService,
    getSupportMessagesBySupportService,
    getSupportMessageByIdService,
    markSupportMessagesAsReadService
} from "../services/supportMessageService.js";

export const createSupportMessageController = async (req, res) => {
    try {
        const {
            sup_codigo,
            remetente_tipo,
            remetente_codigo,
            msg_texto
        } = req.body;

        if (!sup_codigo || !remetente_tipo || !msg_texto) {
            return res.status(400).json({
                success: false,
                error: "Campos obrigatórios não informados."
            });
        }

        const newMessage = await createSupportMessageService({
            sup_codigo,
            remetente_tipo,
            remetente_codigo,
            msg_texto
        });

        return res.status(201).json({
            success: true,
            message: "Mensagem enviada com sucesso",
            data: newMessage
        });

    } catch (error) {
        console.log(error);

        if (
            error.message === "Campos obrigatórios não informados." ||
            error.message === "Chamado não encontrado." ||
            error.message === "Este chamado não aceita novas mensagens."
        ) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            error: "Erro interno, tente novamente mais tarde!"
        });
    }
};

export const getSupportMessagesBySupportController = async (req, res) => {
    try {
        const { sup_codigo } = req.params;

        if (!sup_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do suporte é obrigatório."
            });
        }

        const messages = await getSupportMessagesBySupportService(sup_codigo);

        return res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Erro interno no servidor."
        });
    }
};

export const getSupportMessageByIdController = async (req, res) => {
    try {
        const { msg_codigo } = req.params;

        if (!msg_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código da mensagem é obrigatório."
            });
        }

        const message = await getSupportMessageByIdService(msg_codigo);

        if (!message) {
            return res.status(404).json({
                success: false,
                error: "Mensagem não encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            data: message
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Erro interno no servidor."
        });
    }
};

export const markSupportMessagesAsReadController = async (req, res) => {
    try {
        const { sup_codigo } = req.params;
        const { remetente_tipo } = req.body;

        if (!sup_codigo || !remetente_tipo) {
            return res.status(400).json({
                success: false,
                error: "Campos obrigatórios não informados."
            });
        }

        const result = await markSupportMessagesAsReadService(
            sup_codigo,
            remetente_tipo
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Erro interno no servidor."
        });
    }
};