import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findAttendantByEmail } from '../../repositories/attendantRepository.js';

export const authAttendantService = async (email, senha) => {
    const attendant = await findAttendantByEmail(email);
    if (!attendant) {
        throw new Error('Atendente não encontrado');
    }

    const hash = attendant.ate_senha;
    const isMatch = await bcrypt.compare(senha, hash);
    if (!isMatch) {
        throw new Error('Senha incorreta');
    }

    const token = jwt.sign(
        {ate_codigo: attendant.ate_codigo, ate_email: attendant.ate_email, emp_codigo: attendant.emp_codigo, emp_nome: attendant.emp_nome},
        process.env.JWT_SECRET_EMPLOYEE,
        {expiresIn: process.env.JWT_EXPIRES}
    );

    const { ate_senha, ...attendantWithoutPassword } = attendant;
    return {
        attendant: attendantWithoutPassword,
        token
    };
};
