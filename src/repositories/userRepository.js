import { db } from "../db/db.js";
import { AppError } from "../utils/AppError.js";

export const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM usuarios WHERE usu_email = ?",
        [email]
    );
    return rows[0] || null;
};

export const createUser = async (user) => {
    const { usu_nome, usu_email, usu_senha, usu_status, usu_telefone, usu_cpf } = user;
    const [rows] = await db.query(
        'SELECT usu_codigo FROM usuarios WHERE usu_email = ? LIMIT 1',
        [usu_email]
    );

    if (rows.length > 0) {
        throw new Error('Email já cadastrado, tente outro');
    }

    const [result] = await db.query(
        'INSERT INTO usuarios (usu_nome, usu_email, usu_senha, usu_status, usu_telefone, usu_cpf, usu_created_at, usu_updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [usu_nome, usu_email, usu_senha, usu_status, usu_telefone, usu_cpf]
    );

    return { usu_codigo: result.insertId, usu_nome, usu_email, usu_cpf, usu_telefone };
}

export const updateUser = async (usu_codigo, updateData) => {
    const allowedFields = [
        'usu_nome',
        'usu_email',
        'usu_senha',
        'usu_status',
        'usu_telefone',
        'usu_cpf'
    ];

    const fields = [];
    const values = [];

    if (updateData.usu_telefone) {
        const [existingPhone] = await db.query(
            `SELECT usu_codigo FROM usuarios WHERE usu_telefone = ? AND usu_codigo != ?`,
            [updateData.usu_telefone, usu_codigo]
        );

        if (existingPhone.length > 0) {
            throw new AppError("Este telefone já está em uso por outro usuário.", 409);
        }
    }

    if (updateData.usu_email) {
        const [existingEmail] = await db.query(
            `SELECT usu_codigo FROM usuarios WHERE usu_email = ? AND usu_codigo != ?`,
            [updateData.usu_email, usu_codigo]
        );

        if (existingEmail.length > 0) {
            throw new AppError("Este e-mail já está em uso por outro usuário.", 409);
        }
    }

    for (const key of allowedFields) {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
        }
    }

    if (fields.length === 0) {
        return {
            success: false,
            message: "Nenhum dado para atualizar"
        };
    }

    fields.push("usu_updated_at = ?");
    values.push(new Date());

    values.push(usu_codigo);

    const query = `
        UPDATE usuarios 
        SET ${fields.join(", ")}
        WHERE usu_codigo = ?
    `;

    const [result] = await db.query(query, values);

    return {
        success: true,
        message: "Usuário atualizado com sucesso",
        affectedRows: result.affectedRows
    };
};

export const deleteUser = async (usu_codigo) => {
    const [result] = await db.query(
        'DELETE FROM usuarios WHERE usu_codigo = ?',
        [usu_codigo]
    );
    return {
        message: "Usuário deletado com sucesso",
        affectedRows: result.affectedRows
    };
}

export const getUserById = async (usu_codigo) => {
    const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE usu_codigo = ?',
        [usu_codigo]
    );
    return rows[0] || null;
}
export const getAllUsers = async () => {
    const [result] = await db.query(
        "SELECT usu_codigo, usu_nome, usu_email, usu_status, usu_telefone, usu_cpf FROM usuarios ORDER BY usu_codigo DESC"
    );
    if (result.length === 0) {
        throw new Error('Nenhuma usuário cadastrado no sistema');
    }
    return result;
}

