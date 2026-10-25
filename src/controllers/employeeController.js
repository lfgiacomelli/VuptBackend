import { createEmployeeService, deleteEmployeeService, getEmployeeByIdService, updateEmployeeService, getAllEmployeesService, getAvailableEmployeesService, getEmployeesWithoutMotorcycleService } from "../services/employeeService.js";

export const getAllEmployeesController = async (req, res) => {
    try {
        const { ate_codigo } = req.params;

        if (!ate_codigo) {
            return res.status(400).json({
                error: "O código do atendente é obrigatório."
            })
        }
        const employees = await getAllEmployeesService(ate_codigo);
        if (employees.length === 0) {
            return res.status(404).json({
                error: "A empresa ainda não possui nenhum funcionário (mototáxista) cadastrado"
            })
        }
        return res.status(200).json({
            success: true,
            data: employees
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

export const createEmployeeController = async (req, res) => {
    try {
        const { mot_nome, mot_email, mot_senha, mot_cpf, mot_status } = req.body;

        if (!mot_nome || !mot_email || !mot_senha || !mot_cpf) {
            return res.status(400).json({ error: 'Nome, email, senha e CPF são obrigatórios.' });
        }

        const newUser = await createEmployeeService({ mot_nome, mot_email, mot_senha, mot_cpf, mot_status });
        res.status(201).json({
            success: true,
            message: "Funcionário criado com sucesso",
            data: newUser
        });
    } catch (error) {
        if (error.message === 'CPF já cadastrado, tente outro') {
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

export const updateEmployeeController = async (req, res) => {
    try {
        const { mot_codigo } = req.params;
        if (!mot_codigo) {
            return res.status(400).json({ error: 'Código do funcionário é obrigatório.' });
        }

        const updateData = req.body;

        const result = await updateEmployeeService(mot_codigo, updateData);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao atualizar funcionário, tente novamente mais tarde!"
        });
    }
}

export const deleteEmployeeController = async (req, res) => {
    try {
        const { mot_codigo } = req.params;
        if (!mot_codigo) {
            return res.status(400).json({ error: 'Código do funcionário é obrigatório.' });
        }
        const result = await deleteEmployeeService(mot_codigo);

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

export const getEmployeeByIdController = async (req, res) => {
    try {
        const { mot_codigo } = req.params;
        if (!mot_codigo) {
            return res.status(400).json({ error: 'Código do funcionário é obrigatório.' });
        }
        const user = await getEmployeeByIdService(mot_codigo);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Funcionário não encontrado"
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

export const getAvailableEmployeesController = async (req, res) => {
    try {
        const { ate_codigo } = req.params;
        if (!ate_codigo) {
            return res.status(400).json({ error: 'Código do atendente é obrigatório.' });
        }
        const employees = await getAvailableEmployeesService(ate_codigo);
        if (employees.length === 0) {
            return res.status(404).json({
                error: "Nenhum funcionário disponível no momento"
            });
        }
        return res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
}

export const getEmployeesWithoutMotorcycleController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;
        if (!emp_codigo) {
            return res.status(400).json({ error: 'Código da empresa é obrigatório.' });
        }
        const employees = await getEmployeesWithoutMotorcycleService(emp_codigo);
        if (employees.length === 0) {
            return res.status(404).json({
                error: "Todos os funcionários possuem motocicleta cadastrada."
            });
        }
        return res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });

    }
};