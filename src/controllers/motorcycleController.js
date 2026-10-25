import { createMotorcycleService, deleteMotorcycleService, getAllMotorcyclesService, getMotorcycleByIdService, updateMotorcycleService } from "../services/motorcycleService.js";
import jwt from "jsonwebtoken";

export const createMotorcycleController = async (req, res) => {
    try {
        const { moto_modelo, moto_placa, moto_ano, moto_marca, mot_codigo } = req.body;

        if (!moto_modelo || !moto_placa || !moto_ano || !moto_marca) {
            return res.status(400).json({ error: 'Modelo, placa, ano e marca são obrigatórios.' });
        }

        const newMotorcycle = await createMotorcycleService({ moto_modelo, moto_placa, moto_ano, moto_marca, mot_codigo });

        res.status(201).json({
            success: true,
            message: "Motocicleta adicionada com sucesso",
            data: newMotorcycle
        });
    } catch (error) {
        if (error.message === 'Placa já cadastrada, tente outra') {
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

export const updateMotorcycleController = async (req, res) => {
    try {
        const { moto_codigo } = req.params;
        if (!moto_codigo) {
            return res.status(400).json({ error: 'Código da motocicleta é obrigatório.' });
        }

        const updateData = req.body;

        const result = await updateMotorcycleService(moto_codigo, updateData);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao atualizar motocicleta, tente novamente mais tarde!"
        });
    }
}

export const deleteMotorcycleController = async (req, res) => {
    try {
        const { moto_codigo } = req.params;
        if (!moto_codigo) {
            return res.status(400).json({ error: 'Código da motocicleta é obrigatório.' });
        }
        const result = await deleteMotorcycleService(moto_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao deletar motocicleta, tente novamente mais tarde!"
        });
    }
}

export const getMotorcycleByIdController = async (req, res) => {
    try {
        const { moto_codigo } = req.params;
        if (!moto_codigo) {
            return res.status(400).json({ error: 'Código da motocicleta é obrigatório.' });
        }
        const user = await getMotorcycleByIdService(moto_codigo);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Motocicleta não encontrada"
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

export const getAllMotorcyclesController = async (req, res) => {
    try {
        const { ate_codigo } = req.params;

        if (!ate_codigo) {
            return res.status(400).json({
                error: "O código do atendente é obrigatório."
            })
        }
        const motorcycles = await getAllMotorcyclesService(ate_codigo);
        if (motorcycles.length === 0) {
            return res.status(404).json({
                error: "Nenhum mototáxista possui uma motocicleta cadastrada."
            })
        }
        return res.status(200).json({
            success: true,
            data: motorcycles
        });
    } catch (error) {
        if (error.message) {
            return res.status(500).json({
                error: error.message
            });
        }
        return res.status(500).json({
            error: "Erro no servidor. Tente novamente mais tarde."
        });
    }
}