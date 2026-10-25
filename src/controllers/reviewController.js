import {
    getAvailablesByUserService,
    createAvailableService,
    getAvailablesToExplainService
} from "../services/reviewService.js";

export const getAvailablesByUserController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;
        const result = await getAvailablesByUserService(usu_codigo);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error.message) {
            return res.status(500).json({
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
};

export const createAvailableController = async (req, res) => {
    try {
        const { usu_codigo, via_codigo, ava_comentario, ava_nota } = req.body;

        if (!usu_codigo || !via_codigo || !ava_nota) {
            return res.status(400).json({
                success: false,
                error: "usu_codigo, via_codigo e ava_nota são obrigatórios"
            });
        }

        const result = await createAvailableService({
            usu_codigo,
            via_codigo,
            ava_comentario,
            ava_nota
        });

        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error.message) {
            return res.status(500).json({
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
};

export const getAvailablesToExplainController = async (req, res) => {
    try {
        const result = await getAvailablesToExplainService();

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error.message) {
            return res.status(500).json({
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