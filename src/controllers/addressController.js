import {
    createAddressService,
    updateAddressService,
    deleteAddressService,
    getAddressByIdService,
    getAddressesByUserService
} from "../services/addressService.js";

export const createAddressController = async (req, res) => {
    try {
        const {
            usu_codigo,
            end_apelido,
            end_cep,
            end_logradouro,
            end_numero,
            end_bairro,
            end_cidade,
            end_uf
        } = req.body;

        if (!usu_codigo || !end_apelido || !end_cep || !end_logradouro || !end_numero || !end_bairro || !end_cidade || !end_uf) {
            return res.status(400).json({
                error: "Campos obrigatórios não informados."
            });
        }

        const newAddress = await createAddressService(req.body);

        return res.status(201).json({
            success: true,
            message: "Endereço criado com sucesso",
            data: newAddress
        });

    } catch (error) {

        if (error.message === "Limite máximo de 5 endereços atingido.") {
            return res.status(400).json({
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

export const updateAddressController = async (req, res) => {
    try {
        const { end_codigo } = req.params;

        if (!end_codigo) {
            return res.status(400).json({
                error: "Código do endereço é obrigatório."
            });
        }

        const updateData = req.body;

        const result = await updateAddressService(end_codigo, updateData);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            error: "Erro ao atualizar endereço, tente novamente mais tarde!"
        });
    }
};

export const deleteAddressController = async (req, res) => {
    try {

        const { end_codigo } = req.params;

        if (!end_codigo) {
            return res.status(400).json({
                error: "Código do endereço é obrigatório."
            });
        }

        const result = await deleteAddressService(end_codigo);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            error: "Erro ao deletar endereço, tente novamente mais tarde!"
        });
    }
};

export const getAddressByIdController = async (req, res) => {
    try {

        const { end_codigo } = req.params;

        if (!end_codigo) {
            return res.status(400).json({
                error: "Código do endereço é obrigatório."
            });
        }

        const address = await getAddressByIdService(end_codigo);

        if (!address) {
            return res.status(404).json({
                success: false,
                error: "Endereço não encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            data: address
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

export const getAddressesByUserController = async (req, res) => {
    try {

        const { usu_codigo } = req.params;

        if (!usu_codigo) {
            return res.status(400).json({
                error: "Código do usuário é obrigatório."
            });
        }

        const addresses = await getAddressesByUserService(usu_codigo);

        return res.status(200).json({
            success: true,
            data: addresses
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};