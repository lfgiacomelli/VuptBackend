import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from "../../repositories/userRepository.js";

export const authUserService = async (email, senha) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const hash = user.usu_senha;
    const isMatch = await bcrypt.compare(senha, hash);
    if (!isMatch) {
        throw new Error('Senha incorreta');
    }

    const token = jwt.sign(
        {usu_codigo: user.usu_codigo, usu_email: user.usu_email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES}
    );

    const { usu_senha, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        token
    };
};
