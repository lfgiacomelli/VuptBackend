import {
    createSupportService,
    getSupportByIdService,
    getSupportsByUserService,
    getOpenSupportByUserAndCompanyService,
    cancelSupportByUserService,
    updateSupportDetailsService,
    getSupportsByCompanyService,
    getOpenSupportsByCompanyService,
    getSupportsInAttendanceByAttendantService,
    acceptSupportService,
    finishSupportService,
    cancelSupportByAttendantService,
    getSupportsByStatusAndCompanyService,
    getSupportsCountByCompanyService,
    deleteSupportService,
    getAvailablesTravelsToSupportService
} from "../services/supportService.js";

export const createSupportController = async (req, res) => {
    try {
        const {
            emp_codigo,
            usu_codigo,
            via_codigo,
            sup_motivo,
            sup_descricao
        } = req.body;

        if (!emp_codigo || !usu_codigo || !via_codigo || !sup_motivo) {
            return res.status(400).json({
                success: false,
                error: "Código da empresa, usuário, viagem e motivo são obrigatórios."
            });
        }

        const support = await createSupportService({
            emp_codigo,
            usu_codigo,
            via_codigo,
            sup_motivo,
            sup_descricao
        });

        return res.status(201).json({
            success: true,
            message: "Chamado criado com sucesso",
            data: support
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message || "Erro interno, tente novamente mais tarde!"
        });
    }
};

export const getSupportByIdController = async (req, res) => {
    try {
        const { sup_codigo } = req.params;

        if (!sup_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do chamado é obrigatório."
            });
        }

        const support = await getSupportByIdService(sup_codigo);

        if (!support) {
            return res.status(404).json({
                success: false,
                error: "Chamado não encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            data: support
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

export const getSupportsByUserController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;

        if (!usu_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do usuário é obrigatório."
            });
        }

        const supports = await getSupportsByUserService(usu_codigo);

        return res.status(200).json({
            success: true,
            data: supports
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

export const getOpenSupportByUserAndCompanyController = async (req, res) => {
    try {
        const { usu_codigo, emp_codigo } = req.params;

        if (!usu_codigo || !emp_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do usuário e código da empresa são obrigatórios."
            });
        }

        const support = await getOpenSupportByUserAndCompanyService(usu_codigo, emp_codigo);

        if (!support) {
            return res.status(404).json({
                success: false,
                error: "Nenhum chamado em aberto ou em atendimento foi encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            data: support
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

export const updateSupportDetailsController = async (req, res) => {
    try {
        const { sup_codigo } = req.params;

        if (!sup_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do chamado é obrigatório."
            });
        }

        const updateData = req.body;

        const result = await updateSupportDetailsService(sup_codigo, updateData);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (
            error.message === "O código do chamado é obrigatório" ||
            error.message === "Nenhum dado válido foi enviado para atualização" ||
            error.message === "O motivo do chamado não pode ser vazio"
        ) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao atualizar chamado, tente novamente mais tarde!"
        });
    }
};

export const cancelSupportByUserController = async (req, res) => {
    try {
        const { sup_codigo, usu_codigo } = req.params;

        if (!sup_codigo || !usu_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do chamado e código do usuário são obrigatórios."
            });
        }

        const result = await cancelSupportByUserService(sup_codigo, usu_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (
            error.message === "Chamado não encontrado"
        ) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }

        if (
            error.message === "Você não tem permissão para cancelar este chamado" ||
            error.message === "Somente chamados abertos podem ser cancelados pelo usuário" ||
            error.message === "O código do chamado é obrigatório" ||
            error.message === "O código do usuário é obrigatório"
        ) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao cancelar chamado, tente novamente mais tarde!"
        });
    }
};

export const getSupportsByCompanyController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;

        if (!emp_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código da empresa é obrigatório."
            });
        }

        const supports = await getSupportsByCompanyService(emp_codigo);

        return res.status(200).json({
            success: true,
            data: supports
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

export const getOpenSupportsByCompanyController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;

        if (!emp_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código da empresa é obrigatório."
            });
        }

        const supports = await getOpenSupportsByCompanyService(emp_codigo);

        return res.status(200).json({
            success: true,
            data: supports
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

export const getSupportsInAttendanceByAttendantController = async (req, res) => {
    try {
        const { ate_codigo } = req.params;

        if (!ate_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do atendente é obrigatório."
            });
        }

        const supports = await getSupportsInAttendanceByAttendantService(ate_codigo);

        return res.status(200).json({
            success: true,
            data: supports
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

export const acceptSupportController = async (req, res) => {
    try {
        const { sup_codigo } = req.params;
        const { ate_codigo } = req.body;

        if (!sup_codigo || !ate_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do chamado e código do atendente são obrigatórios."
            });
        }

        const result = await acceptSupportService(sup_codigo, ate_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (
            error.message === "Chamado não encontrado" ||
            error.message === "Atendente não encontrado"
        ) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }

        if (
            error.message === "Esse chamado não está disponível para atendimento" ||
            error.message === "Este atendente não pertence à empresa do chamado" ||
            error.message === "O código do chamado é obrigatório" ||
            error.message === "O código do atendente é obrigatório"
        ) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao aceitar chamado, tente novamente mais tarde!"
        });
    }
};

export const finishSupportController = async (req, res) => {
    try {
        const { sup_codigo } = req.params;
        const { ate_codigo } = req.body;

        if (!sup_codigo || !ate_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do chamado e código do atendente são obrigatórios."
            });
        }

        const result = await finishSupportService(sup_codigo, ate_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error.message === "Chamado não encontrado") {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }

        if (
            error.message === "Apenas o atendente responsável pode finalizar este chamado" ||
            error.message === "Esse chamado já foi finalizado" ||
            error.message === "Esse chamado foi cancelado" ||
            error.message === "O código do chamado é obrigatório" ||
            error.message === "O código do atendente é obrigatório"
        ) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao finalizar chamado, tente novamente mais tarde!"
        });
    }
};

export const cancelSupportByAttendantController = async (req, res) => {
    try {
        const { sup_codigo } = req.params;
        const { ate_codigo } = req.body;

        if (!sup_codigo || !ate_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do chamado e código do atendente são obrigatórios."
            });
        }

        const result = await cancelSupportByAttendantService(sup_codigo, ate_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error.message === "Chamado não encontrado") {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }

        if (
            error.message === "Apenas o atendente responsável pode cancelar este chamado" ||
            error.message === "Somente chamados em atendimento podem ser cancelados pelo atendente" ||
            error.message === "O código do chamado é obrigatório" ||
            error.message === "O código do atendente é obrigatório"
        ) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao cancelar chamado, tente novamente mais tarde!"
        });
    }
};

export const getSupportsByStatusAndCompanyController = async (req, res) => {
    try {
        const { emp_codigo, sup_status } = req.params;

        if (!emp_codigo || !sup_status) {
            return res.status(400).json({
                success: false,
                error: "Código da empresa e status do chamado são obrigatórios."
            });
        }

        const supports = await getSupportsByStatusAndCompanyService(emp_codigo, sup_status);

        return res.status(200).json({
            success: true,
            data: supports
        });
    } catch (error) {
        if (
            error.message === "O código da empresa é obrigatório" ||
            error.message === "O status do chamado é obrigatório" ||
            error.message === "Status de chamado inválido"
        ) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao buscar chamados por status, tente novamente mais tarde!"
        });
    }
};

export const getAvailablesTravelsToSupportController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;
        if (!usu_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do usuário é obrigatório."
            });
        }
        const travels = await getAvailablesTravelsToSupportService(usu_codigo);

        return res.status(200).json({
            success: true,
            data: travels
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao buscar viagens disponíveis para chamado, tente novamente mais tarde!"
        });
    }
};

export const getSupportsCountByCompanyController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;

        if (!emp_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código da empresa é obrigatório."
            });
        }

        const counts = await getSupportsCountByCompanyService(emp_codigo);

        return res.status(200).json({
            success: true,
            data: counts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao buscar contadores de chamados, tente novamente mais tarde!"
        });
    }
};

export const deleteSupportController = async (req, res) => {
    try {
        const { sup_codigo } = req.params;

        if (!sup_codigo) {
            return res.status(400).json({
                success: false,
                error: "Código do chamado é obrigatório."
            });
        }

        const result = await deleteSupportService(sup_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao deletar chamado, tente novamente mais tarde!"
        });
    }
};