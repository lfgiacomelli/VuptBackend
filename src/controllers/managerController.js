import { createManagerService, deleteManagerService, getManagerByIdService, updateManagerService, getManagersService } from "../services/managerService.js";

import jwt from "jsonwebtoken";

export const createManagerController = async (req, res) => {
    try {
        const { ges_nome, ges_email, ges_senha, ges_telefone, ges_cpf } = req.body;
        if (!ges_nome || !ges_email || !ges_senha || !ges_telefone || !ges_cpf) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const newManager = await createManagerService({ ges_nome, ges_email, ges_senha, ges_telefone, ges_cpf });

        const token = jwt.sign({
            id: newManager.ges_codigo,
            email: newManager.ges_email
        }, process.env.JWT_SECRET_MANAGER, {
            expiresIn: process.env.JWT_EXPIRES
        });

        res.status(201).json({
            success: true,
            message: "Gestor criado com sucesso",
            data: newManager,
            token
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

export const updateManagerController = async (req, res) => {
    try {
        const { ges_codigo } = req.params;
        if (!ges_codigo) {
            return res.status(400).json({ error: 'Código do gestor é obrigatório.' });
        }

        const updateData = req.body;

        const result = await updateManagerService(ges_codigo, updateData);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao atualizar gestor, tente novamente mais tarde!"
        });
    }
}

export const deleteManagerController = async (req, res) => {
    try {
        const { ges_codigo } = req.params;
        if (!ges_codigo) {
            return res.status(400).json({ error: 'Código do gestor é obrigatório.' });
        }
        const result = await deleteManagerService(ges_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao deletar gestor, tente novamente mais tarde!"
        });
    }
}

export const getManagerByIdController = async (req, res) => {
    try {
        const { ges_codigo } = req.params;
        if (!ges_codigo) {
            return res.status(400).json({ error: 'Código do gestor é obrigatório.' });
        }
        const user = await getManagerByIdService(ges_codigo);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Gestor não encontrado"
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
};
export const getManagersController = async (req, res) => {
    try {
        const managers = await getManagersService();
        if (!managers) {
            return res.status(404).json({
                success: false,
                error: "Gestores não encontrados"
            });
        }
        return res.status(200).json({
            success: true,
            data: managers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};



