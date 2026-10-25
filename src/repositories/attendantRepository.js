import { db } from "../db/db.js";

export const findAttendantByEmail = async (ate_email) => {
    const [rows] = await db.query(
        "SELECT a.*, e.emp_nome FROM atendentes a INNER JOIN empresas e ON a.emp_codigo = e.emp_codigo WHERE a.ate_email = ? LIMIT 1",
        [ate_email]
    );
    return rows[0] || null;
};

export const getAttendantsByCompany = async (emp_codigo) => {
    const [rows] = await db.query(
        "SELECT * FROM atendentes WHERE emp_codigo = ?",
        [emp_codigo]
    );
    return rows;
}

export const createAttendant = async (attendant) => {
    const { ate_nome, ate_email, ate_senha, emp_codigo } = attendant;
    const [rows] = await db.query(
        'SELECT ate_codigo FROM atendentes WHERE ate_email = ? LIMIT 1',
        [ate_email]
    );

    if (rows.length > 0) {
        throw new Error('Email já cadastrado, tente outro');
    }

    const [result] = await db.query(
        'INSERT INTO atendentes (ate_nome, ate_email, ate_senha, emp_codigo, ate_created_at, ate_updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [ate_nome, ate_email, ate_senha, emp_codigo]
    );

    return { ate_codigo: result.insertId, ate_nome, ate_email };
}

export const updateAttendant = async (ate_codigo, updateData) => {
    const allowedFields = ['ate_nome', 'ate_email', 'ate_senha'];
    const fields = [];
    const values = [];

    for (const key in allowedFields) {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
        }
    }

    if (!fields.length) {
        return { message: "Nenhum dado para atualizar" };
    }

    fields.push("ate_updated_at = ?");
    values.push(new Date());
    values.push(ate_codigo);

    const query = `
        UPDATE atendentes 
        SET ${fields.join(", ")}
        WHERE ate_codigo = ?
    `;

    const [result] = await db.query(query, values);
    return {
        message: "Atendente atualizado com sucesso",
        affectedRows: result.affectedRows
    }
}

export const deleteAttendant = async (ate_codigo) => {
    const [result] = await db.query(
        'DELETE FROM atendentes WHERE ate_codigo = ?',
        [ate_codigo]
    );
    return {
        message: "Atendente deletado com sucesso",
        affectedRows: result.affectedRows
    };
}

export const getAttendantById = async (ate_codigo) => {
    const [rows] = await db.query(
        'SELECT * FROM atendentes WHERE ate_codigo = ?',
        [ate_codigo]
    );
    return rows[0] || null;
}
