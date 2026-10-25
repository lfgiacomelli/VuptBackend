import { db } from "../db/db.js";
export const getAllEmployees = async (ate_codigo) => {
    const [result] = await db.query(
        `
        SELECT 
            m.mot_codigo,
            m.mot_nome,
            m.mot_email,
            m.mot_telefone,
            m.mot_cpf,
            m.mot_status,
            m.emp_codigo,
            m.mot_created_at,
            m.mot_updated_at
        FROM mototaxistas m
        JOIN atendentes a ON m.emp_codigo = a.emp_codigo
        WHERE a.ate_codigo = ?;
        `,
        [ate_codigo]
    );

    return result;
};
export const createEmployee = async (employee) => {
    const { mot_nome, mot_telefone, mot_cpf, mot_status, emp_codigo } = employee;
    const [rows] = await db.query(
        'SELECT mot_codigo FROM mototaxistas WHERE mot_cpf = ? LIMIT 1',
        [mot_cpf]
    );

    if (!emp_codigo) {
        throw new Error('Código da empresa é obrigatório.');
    }

    if (rows.length > 0) {
        throw new Error('CPF já cadastrado, tente outro');
    }

    const [result] = await db.query(
        'INSERT INTO mototaxistas (mot_nome, mot_email, mot_senha, mot_telefone, mot_cpf, mot_status, emp_codigo, mot_created_at, mot_updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [mot_nome, mot_telefone, mot_cpf, mot_status, emp_codigo]
    );

    return { mot_codigo: result.insertId, mot_nome, mot_telefone, mot_cpf, mot_status };
}

export const updateEmployee = async (mot_codigo, updateData) => {
    const allowedFields = ['mot_nome', 'mot_telefone', 'mot_cpf', 'mot_status'];
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

    fields.push("mot_updated_at = ?");
    values.push(new Date());
    values.push(mot_codigo);

    const query = `
        UPDATE mototaxistas 
        SET ${fields.join(", ")}
        WHERE mot_codigo = ?
    `;

    const [result] = await db.query(query, values);
    return {
        message: "Usuário atualizado com sucesso",
        affectedRows: result.affectedRows
    }
}

export const deleteEmployee = async (mot_codigo) => {
    const [result] = await db.query(
        'DELETE FROM mototaxistas WHERE mot_codigo = ?',
        [mot_codigo]
    );
    return {
        message: "Mototaxista deletado com sucesso",
        affectedRows: result.affectedRows
    };
}

export const getEmployeeById = async (mot_codigo) => {
    const [rows] = await db.query(
        'SELECT * FROM mototaxistas WHERE mot_codigo = ?',
        [mot_codigo]
    );
    return rows[0] || null;
}

export const getAvailableEmployees = async (ate_codigo) => {
    const [result] = await db.query(
        `
    SELECT DISTINCT m.*
    FROM mototaxistas m
    JOIN atendentes a ON m.emp_codigo = a.emp_codigo
    LEFT JOIN motocicletas mo ON mo.mot_codigo = m.mot_codigo
    WHERE a.ate_codigo = ?
      AND (
        m.mot_status = 'disponível'
        AND mo.mot_codigo IS NOT NULL
      );
    `,
        [ate_codigo]
    );

    return result;
};

export const getEmployeeWithoutMotorcycle = async (emp_codigo) => {
    const [result] = await db.query(
        `
        SELECT DISTINCT m.mot_codigo, m.mot_nome
            FROM mototaxistas m
        JOIN empresas e ON m.emp_codigo = e.emp_codigo
            LEFT JOIN motocicletas mo ON mo.mot_codigo = m.mot_codigo
        WHERE e.emp_codigo = ?
        AND mo.mot_codigo IS NULL;
    `,
        [emp_codigo]
    );
    return result;
}
