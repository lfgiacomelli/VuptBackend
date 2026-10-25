import { getTravelByIdService, getTravelsByUserService, getMotorcycleService, getActiveTravelService, getOriginAndDestinationService, finishTravelService, getTravelsService } from "../services/travelService.js";

export const getTravelsByUserController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;
        const result = await getTravelsByUserService(usu_codigo);
        return res.status(200).json({ success: true, data: result });
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

export const getTravelByIdController = async (req, res) => {
    try {
        const { via_codigo } = req.params;
        const result = await getTravelByIdService(via_codigo);
        return res.status(200).json({ success: true, data: result });
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

export const getMotorcycleController = async (req, res) => {
    try {
        const { via_codigo } = req.params;
        const result = await getMotorcycleService(via_codigo);
        return res.status(200).json({ success: true, data: result });
    }
    catch (error) {
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


export const getActiveTravelController = async (req, res) => {
    try {
        const { usu_codigo } = req.params;
        const travel = await getActiveTravelService(usu_codigo);
        if (!travel) {
            return res.status(404).json({
                success: false,
                message: "Nenhuma viagem ativa encontrada para este usuário"
            });
        }
        return res.status(200).json({
            success: true,
            data: travel
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
}

export const getOriginAndDestinationController = async (req, res) => {
    try {
        const { via_codigo } = req.params;
        if (!via_codigo) {
            return res.status(400).json({
                success: false,
                message: "O código da viagem precisa ser informado"
            });
        }
        const addresses = await getOriginAndDestinationService(via_codigo);
        return res.status(200).json({
            success: true,
            data: addresses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
}
export const getTravelsController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;
        if (!emp_codigo) {
            return res.status(400).json({ error: 'Código da empresa é obrigatório.' });
        }
        const travels = await getTravelsService(emp_codigo);
        return res.status(200).json({
            success: true,
            data: travels
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const finishTravelController = async (req, res) => {
    try {
        const { via_codigo } = req.params;
        if (!via_codigo) {
            return res.status(400).json({ error: 'Código da viagem é obrigatório.' });
        }

        const result = await finishTravelService(via_codigo);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};