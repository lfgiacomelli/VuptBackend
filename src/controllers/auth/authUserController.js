import { authUserService } from "../../services/auth/authUserService.js";

export const authUserController = async (req, res) => {
    try {
        const { usu_email, usu_senha } = req.body;
        if (!usu_email || !usu_senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const result = await authUserService(usu_email, usu_senha);
        if(!result){
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
        return res.status(200).json({
            success: true,
            token: result.token,
            user: result.user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao autenticar usuário, tente novamente mais tarde!"
        });
    }

}