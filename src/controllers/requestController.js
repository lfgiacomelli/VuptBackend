import { cancelRequestService, createRequestService, getRequestByIdService, getRequestsByUserService, getTravelIdByRequestIdService, acceptRequestService, getRequestsService, refuseRequestService } from "../services/requestService.js";

export const createRequestController = async (req, res) => {
    try {
        const result = await createRequestService(req.body);
        return res.status(201).json({ success: true, data: result, sol_codigo: result.insertId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const getRequestByIdController = async (req, res) => {
    try {
        const { sol_codigo } = req.params;
        const result = await getRequestByIdService(sol_codigo);
        if (result.length === 0) {
            return res.status(404).json({ error: "Solicitação não encontrada" });
        }
        return res.status(200).json({ success: true, data: result[0] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const getRequestsByUserController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;
        const result = await getRequestsByUserService(usu_codigo);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const cancelRequestController = async (req, res) => {
    try {
        const { sol_codigo } = req.params;
        const result = await cancelRequestService(sol_codigo);
        return res.status(200).json({ success: true, data: result, message: "Solicitação cancelada com sucesso" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const getTravelIdByRequestIdController = async (req, res) => {
    try {
        const { sol_codigo } = req.params;
        const result = await getTravelIdByRequestIdService(sol_codigo);
        if (!result) {
            return res.status(404).json({ error: "Viagem não encontrada para esta solicitação" });
        }
        return res.status(200).json({ success: true, data: { via_codigo: result } });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
export const getRequestsController = async (req, res) => {
    try {
        const { ate_codigo } = req.params;
        const requests = await getRequestsService(ate_codigo);
        return res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
}
export const acceptRequestController = async (req, res) => {
    try {
        const { sol_codigo } = req.params;
        const { mot_codigo, ate_codigo } = req.body;

        const result = await acceptRequestService(
            sol_codigo,
            mot_codigo,
            ate_codigo
        );

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};



export const refuseRequestController = async (req, res) => {
    try {
        const { sol_codigo } = req.params;
        if (!sol_codigo) {
            return res.status(400).json({ error: 'Código da solicitação é obrigatório.' });
        }
        const result = await refuseRequestService(sol_codigo);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}