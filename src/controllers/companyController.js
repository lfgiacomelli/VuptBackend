import {createCompanyService, addFirstAttendantToCompanyService, deleteCompanyService, getAvailableCompaniesService, getCompaniesService, getCompanyByIdService } from "../services/companyService.js";

export const createCompanyController = async (req, res) => {
    try {
        const company = req.body;
        const result = await createCompanyService(company);
        return res.status(201).json({
            success: true,
            message: "Empresa criada com sucesso",
            data: result
        });
    } catch (error) {
        if (error.message === 'CNPJ já cadastrado, tente outro') {
            return res.status(409).json({
                success: false,
                error: error.message
            });
            return;
        }
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao criar empresa, tente novamente mais tarde!"
        });
    };
}

export const updateCompanyController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;
        const updateData = req.body;
        const result = await updateCompanyService(emp_codigo, updateData);
        return res.status(200).json({
            success: true,
            message: result.message
        });
        console.log(message);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao atualizar empresa, tente novamente mais tarde!"
        });
    }
};

export const deleteCompanyController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;
        const result = await deleteCompanyService(emp_codigo);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao deletar empresa, tente novamente mais tarde!"
        });
    }
};

export const getCompaniesController = async (req, res) => {
    try {
        const companies = await getCompaniesService();
        return res.status(200).json({
            success: true,
            data: companies
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao buscar empresas, tente novamente mais tarde!"
        });
    }
};

export const addFirstAttendantToCompanyController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;
        const attendant = req.body;
        const result = await addFirstAttendantToCompanyService(emp_codigo, attendant);
        return res.status(201).json({
            success: true,
            message: "Atendente cadastrado com sucesso",
            data: result
        });
    } catch (error) {
        if (error.message === 'Esta empresa já possui um atendente cadastrado') {
            return res.status(409).json({
                success: false,
                error: error.message
            });
        }
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao cadastrar atendente, tente novamente mais tarde!"
        });
    }
}

export const getAvailableCompaniesController = async (req, res) => {
    try {
        const { city } = req.params;
        const companies = await getAvailableCompaniesService(city);

        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ainda não temos empresas cadastradas nessa cidade. Volte em breve!"
            });
        }
        return res.status(200).json({
            success: true,
            data: companies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

export const getCompanyByIdController = async (req, res) => {
    try {
        const { emp_codigo } = req.params;
        const company = await getCompanyByIdService(emp_codigo);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: "Empresa não encontrada"
            });
        }
        return res.status(200).json({
            success: true,
            data: company
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};


export const getPopularCompaniesController = async (req, res) => {
    try {
        const { city } = req.params;
        const companies = await getPopularCompaniesService(city);
        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                data: [],
            });
        }
        return res.status(200).json({
            success: true,
            data: companies
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });

    }
};
