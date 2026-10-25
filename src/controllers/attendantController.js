import { createAttendantService, updateAttendantService, deleteAttendantService, getAttendantByIdService, getAttendantsByCompanyService } from "../services/attendantService.js";

export const getAttendantsByCompanyController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;
        if (!emp_codigo) {
            return res.status(400).json({ error: 'Código da empresa é obrigatório.' });
        }
        const attendants = await getAttendantsByCompanyService(emp_codigo);
        return res.status(200).json({
            success: true,
            data: attendants
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({

            success: false,
            error: error.message
        });
    }
}

export const createAttendantController = async (req, res) => {
    try {
        const { ate_nome, ate_email, ate_senha, emp_codigo } = req.body;

        if (!ate_nome || !ate_email || !ate_senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
        }

        const newAttendant = await createAttendantService({ ate_nome, ate_email, ate_senha, emp_codigo });
        res.status(201).json({
            success: true,
            message: "Atendente criado com sucesso",
            data: newAttendant
        });
    } catch (error) {
        if (error.message === 'Email já cadastrado, tente outro') {
            return res.status(409).json({
                success: false,
                error: error.message
            });
        }
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro interno, tente novamente mais tarde!"
        });
    }
}

export const updateAttendantController = async (req, res) => {
    try {
        const { ate_codigo } = req.params;
        if (!ate_codigo) {
            return res.status(400).json({ error: 'Código do atendente é obrigatório.' });
        }

        const updateData = req.body;

        const result = await updateAttendantService(ate_codigo, updateData);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao atualizar atendente, tente novamente mais tarde!"
        });
    }
}

export const deleteAttendantController = async (req, res) => {
    try {
        const { ate_codigo } = req.params;
        if (!ate_codigo) {
            return res.status(400).json({ error: 'Código do atendente é obrigatório.' });
        }
        const result = await deleteAttendantService(ate_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao deletar usuário, tente novamente mais tarde!"
        });
    }
}

export const getAttendantByIdController = async (req, res) => {
    try {
        const { ate_codigo } = req.params;
        if (!ate_codigo) {
            return res.status(400).json({ error: 'Código do atendente é obrigatório.' });
        }
        const user = await getAttendantByIdService(ate_codigo);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Atendente não encontrado"
            });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
}





