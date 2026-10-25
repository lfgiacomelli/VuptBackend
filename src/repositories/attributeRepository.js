import { db } from "../db/db.js";
import { AppError } from "../utils/AppError.js";

export const createAttribute = async (attribute) => {
    const { emp_codigo, atr_valor_fixo, atr_valor_km } = attribute;
    const [rows] = await db.query(
        'SELECT emp_codigo FROM empresas WHERE emp_codigo = ? LIMIT 1',
        [emp_codigo]
    );

    if (rows.length > 0) {
        throw new Error('Atributo da empresa indicada já cadastrado.');
    }

    const [result] = await db.query(
        'INSERT INTO atributos (emp_codigo, atr_valor_fixo, atr_valor_km, atr_created_at, atr_updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [emp_codigo, atr_valor_fixo, atr_valor_km]
    );

    return { atr_codigo: result.insertId, emp_codigo, atr_valor_fixo, atr_valor_km };
}

export const updateAttribute = async (atr_codigo, updateData) => {
    const allowedFields = ['emp_codigo', 'atr_valor_fixo', 'atr_valor_km'];
    const fields = [];
    const values = [];

    const [rows] = await db.query(
        `SELECT atr_updated_at FROM atributos WHERE atr_codigo = ? LIMIT 1`,
        [atr_codigo]
    );

    if (!rows.length) {
        return { message: "Atributo não encontrado" };
    }

    const lastUpdate = rows[0].atr_updated_at;

    if (lastUpdate) {
        const now = new Date();
        const lastDate = new Date(lastUpdate);

        const diffMs = now - lastDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < 30) {
            throw new AppError("Este atributo só pode ser atualizado após 30 dias da última alteração", 400);
        }
    }

    for (const key of allowedFields) {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
        }
    }

    if (!fields.length) {
        return { message: "Nenhum dado para atualizar" };
    }

    fields.push("atr_updated_at = ?");
    values.push(new Date());
    values.push(atr_codigo);

    const query = `
        UPDATE atributos
        SET ${fields.join(", ")}
        WHERE atr_codigo = ?
    `;

    const [result] = await db.query(query, values);

    return {
        message: "Atributo atualizado com sucesso",
        affectedRows: result.affectedRows
    };
};

export const deleteAttribute = async (atr_codigo) => {
    const [result] = await db.query(
        'DELETE FROM atributos WHERE atr_codigo = ?',
        [atr_codigo]
    );
    return {
        message: "Atributo deletado com sucesso",
        affectedRows: result.affectedRows
    };
}

export const getAttributeById = async (atr_codigo) => {
    const [rows] = await db.query(
        'SELECT a.*, at.emp_codigo FROM atributos a, atendentes at WHERE a.atr_codigo = ? AND a.emp_codigo = at.emp_codigo',
        [atr_codigo]
    );
    return rows[0] || null;
}