import { createUserService, updateUserService, deleteUserService, getUserByIdService, getAllUsersService } from "../services/userService.js";
import jwt from "jsonwebtoken";

export const createUserController = async (req, res) => {
    try {
        const { usu_nome, usu_email, usu_senha, usu_status, usu_telefone, usu_cpf } = req.body;

        if (!usu_nome || !usu_email || !usu_senha || !usu_telefone || !usu_cpf) {
            return res.status(400).json({ error: 'Nome, email, senha, telefone e CPF são obrigatórios.' });
        }

        const newUser = await createUserService({ usu_nome, usu_email, usu_senha, usu_status, usu_telefone, usu_cpf });

        const token = jwt.sign({
            id: newUser.usu_codigo,
            email: newUser.usu_email,
            cpf: newUser.usu_cpf,
            telefone: newUser.usu_telefone,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        res.status(201).json({
            success: true,
            message: "Conta criada com sucesso",
            data: newUser,
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
export const updateUserController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;

        if (!usu_codigo) {
            return res.status(400).json({
                success: false,
                message: 'Código do usuário é obrigatório.'
            });
        }

        const updateData = req.body;

        const result = await updateUserService(usu_codigo, updateData);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        console.log(error);

        if(error.message === "Este e-mail já está em uso por outro usuário.") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        if (error.message === "Este telefone já está em uso por outro usuário.") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar usuário, tente novamente mais tarde!"
        });
    }
};

export const deleteUserController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;
        if (!usu_codigo) {
            return res.status(400).json({ error: 'Código do usuário é obrigatório.' });
        }
        const result = await deleteUserService(usu_codigo);

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

export const getUserByIdController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;
        if (!usu_codigo) {
            return res.status(400).json({ error: 'Código do usuário é obrigatório.' });
        }
        const user = await getUserByIdService(usu_codigo);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Usuário não encontrado"
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

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsersService();
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao buscar usuários, tente novamente mais tarde!"
        });
    }
}
