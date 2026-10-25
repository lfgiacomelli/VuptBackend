import { db } from "../db/db.js";

export const findManagerByEmail = async (ges_email) => {
    const [rows] = await db.query(
        "SELECT * FROM gestores WHERE ges_email = ? LIMIT 1",
        [ges_email]
    );
    return rows[0] || null;
}

export const createManager = async (manager) => {
    const { ges_nome, ges_email, ges_senha, ges_telefone, ges_cpf } = manager;
    const [rows] = await db.query(
        'SELECT ges_codigo FROM gestores WHERE ges_email = ? LIMIT 1',
        [ges_email]
    );

    if (rows.length > 0) {
        throw new Error('Email já cadastrado, tente outro');
    }

    const [result] = await db.query(
        'INSERT INTO gestores (ges_nome, ges_email, ges_senha, ges_telefone, ges_cpf, ges_created_at, ges_updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [ges_nome, ges_email, ges_senha, ges_telefone, ges_cpf]
    );

    return { ges_codigo: result.insertId, ges_nome, ges_email };
}

export const updateManager = async (ges_codigo, updateData) => {
    const allowedFields = ['ges_nome', 'ges_email', 'ges_senha', 'ges_telefone', 'ges_cpf', 'ges_status'];
    const fields = [];
    const values = [];

    for (const key of allowedFields) {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
        }
    }

    if (!fields.length) {
        return { message: "Nenhum dado para atualizar" };
    }

    fields.push("ges_updated_at = ?");
    values.push(new Date());
    values.push(ges_codigo);

    const query = `
        UPDATE gestores 
        SET ${fields.join(", ")}
        WHERE ges_codigo = ?
    `;

    const [result] = await db.query(query, values);
    return {
        message: "Gestor atualizado com sucesso",
        affectedRows: result.affectedRows
    }
}

export const deleteManager = async (ges_codigo) => {
    const [result] = await db.query(
        'DELETE FROM gestores WHERE ges_codigo = ?',
        [ges_codigo]
    );
    return {
        message: "Gestor deletado com sucesso",
        affectedRows: result.affectedRows
    };
}

export const getManagerById = async (ges_codigo) => {
    const [rows] = await db.query(
        'SELECT * FROM gestores WHERE ges_codigo = ?',
        [ges_codigo]
    );
    return rows[0] || null;
}
export const getManagers = async () => {
    const [rows] = await db.query(
        'SELECT * FROM gestores',
        []
    );
    return rows;
}

