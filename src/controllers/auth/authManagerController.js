import { authManagerService } from "../../services/auth/authManagerService.js";

export const authManagerController = async (req, res) => {
    try {
        const { ges_email, ges_senha } = req.body;
       
        if (!ges_email || !ges_senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const result = await authManagerService(ges_email, ges_senha);
        
        if (!result) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        return res.status(200).json({
            success: true,
            token: result.token,
            manager: result.manager
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao autenticar gestor, tente novamente mais tarde!"
        });
    }
}