import { db } from "../db/db.js";

export const getAllMotorcycles = async (ate_codigo) => {
    const [result] = await db.query(
        `SELECT m.*, mo.mot_nome
            FROM motocicletas m
            INNER JOIN mototaxistas mo 
                ON m.mot_codigo = mo.mot_codigo
            INNER JOIN atendentes a 
                ON a.emp_codigo = mo.emp_codigo
            WHERE ate_codigo = ?;`,
        [ate_codigo]
    );

    return result;
}

export const createMotorcycle = async (motorcycle) => {
    const { emp_codigo, mot_codigo, moto_modelo, moto_placa, moto_ano, moto_marca } = motorcycle;
    const [rows] = await db.query(
        'SELECT moto_codigo FROM motocicletas WHERE moto_placa = ? LIMIT 1',
        [moto_placa]
    );

    if (rows.length > 0) {
        throw new Error('Placa já cadastrada, tente outra');
    }

    const [result] = await db.query(
        'INSERT INTO motocicletas (emp_codigo, mot_codigo, moto_modelo, moto_placa, moto_ano, moto_marca, moto_created_at, moto_updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [emp_codigo, mot_codigo, moto_modelo, moto_placa, moto_ano, moto_marca]
    );

    return { moto_codigo: result.insertId, emp_codigo, mot_codigo, moto_modelo, moto_placa, moto_ano, moto_marca };
}

export const updateUser = async (moto_codigo, updateData) => {
    const allowedFields = ['moto_modelo', 'moto_placa', 'moto_ano', 'moto_marca'];
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

    fields.push("moto_updated_at = ?");
    values.push(new Date());
    values.push(moto_codigo);

    const query = `
        UPDATE motocicletas 
        SET ${fields.join(", ")}
        WHERE moto_codigo = ?
    `;

    const [result] = await db.query(query, values);
    return {
        message: "Motocicleta atualizada com sucesso",
        affectedRows: result.affectedRows
    }
}

export const deleteMotorcycle = async (moto_codigo) => {
    const [result] = await db.query(
        'DELETE FROM motocicletas WHERE moto_codigo = ?',
        [moto_codigo]
    );
    return {
        message: "Motocicleta deletada com sucesso",
        affectedRows: result.affectedRows
    };
}

export const getMotorcycleById = async (moto_codigo) => {
    const [rows] = await db.query(
        `
        SELECT 
            m.*,
            mo.mot_nome,
            COALESCE(SUM(s.sol_distancia_km), 0) AS distancia_total_km
            FROM motocicletas m
            JOIN mototaxistas mo 
                ON m.mot_codigo = mo.mot_codigo
            LEFT JOIN viagens v 
                ON v.mot_codigo = m.mot_codigo
            LEFT JOIN solicitacoes s 
                ON s.sol_codigo = v.sol_codigo
            WHERE m.moto_codigo = ?
            GROUP BY m.moto_codigo;
        `,
        [moto_codigo]
    );
    return rows[0] || null;
}