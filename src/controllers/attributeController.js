import { createUseAttributeService, deleteAttributeService, getAttributeByIdService, updateAttributeService } from "../services/attributeService.js";
import jwt from "jsonwebtoken";

export const createAttributeController = async (req, res) => {
    try {
        const { emp_codigo, atr_valor_fixo, atr_valor_km } = req.body;

        if (!emp_codigo || !atr_valor_fixo || !atr_valor_km) {
            return res.status(400).json({ error: 'Código da empresa, valor fixo e valor por km são obrigatórios.' });
        }

        const newAttribute = await createUseAttributeService({ emp_codigo, atr_valor_fixo, atr_valor_km });

        res.status(201).json({
            success: true,
            message: "Conta criada com sucesso",
            data: newAttribute,
        });
    } catch (error) {
        if (error.message === 'Atributo já cadastrado, tente outro') {
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

export const updateAttributeController = async (req, res) => {
    try {
        const { atr_codigo } = req.params;
        if (!atr_codigo) {
            return res.status(400).json({ error: 'Código do atributo é obrigatório.' });
        }

        const updateData = req.body;

        const result = await updateAttributeService(atr_codigo, updateData);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao atualizar atributo, tente novamente mais tarde!"
        });
    }
}

export const deleteAttributeController = async (req, res) => {
    try {
        const { atr_codigo } = req.params;
        if (!atr_codigo) {
            return res.status(400).json({ error: 'Código do atributo é obrigatório.' });
        }
        const result = await deleteAttributeService(atr_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao deletar atributo, tente novamente mais tarde!"
        });
    }
}

export const getAttributeByIdController = async (req, res) => {
    try {
        const { atr_codigo } = req.params;
        if (!atr_codigo) {
            return res.status(400).json({ error: 'Código do atributo é obrigatório.' });
        }
        const user = await getAttributeByIdService(atr_codigo);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Atributo não encontrado"
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