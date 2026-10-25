import { authAttendantService } from "../../services/auth/authAttendantService.js";

export const authAttendantController = async (req, res) => {
    try {
        const { ate_email, ate_senha } = req.body;
        if (!ate_email || !ate_senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }
        const result = await authAttendantService(ate_email, ate_senha);
        if(!result){
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
        return res.status(200).json({
            success: true,
            token: result.token,
            attendant: result.attendant
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Erro ao autenticar atendente, tente novamente mais tarde!"
        });
    }
}