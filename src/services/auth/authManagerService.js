import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { findManagerByEmail } from "../../repositories/managerRepository.js";

export const authManagerService = async (email, senha) => {
    const manager = await findManagerByEmail(email);
    if (!manager) {
        throw new Error('Gestor não encontrado');
    }
    const hash = manager.ges_senha;
    const isMatch = await bcrypt.compare(senha, hash);
    if (!isMatch) {
        throw new Error('Senha incorreta');
    }

    const token = jwt.sign(
        { ges_codigo: manager.ges_codigo, ges_email: manager.ges_email },
        process.env.JWT_SECRET_MANAGER,
        { expiresIn: process.env.JWT_EXPIRES }
    ); 
    const { ges_senha, ...managerWithoutPassword } = manager;
    return {
        manager: managerWithoutPassword,
        token
    };
}
