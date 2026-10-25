import { db } from "../db/db.js";

export const getRequestsByUser = async (usu_codigo) => {
    const [result] = await db.query(
        "SELECT * FROM solicitacoes WHERE usu_codigo = ? ORDER BY sol_created_at DESC",
        [usu_codigo]
    );
    return result;
};

export const createRequest = async (request) => {
    const {emp_codigo, usu_codigo, sol_origem, sol_destino, sol_forma_pagamento, sol_distancia_km, sol_valor_estimado} = request;
    const [result] = await db.query(
        "INSERT INTO solicitacoes (emp_codigo, usu_codigo, sol_origem, sol_destino, sol_forma_pagamento, sol_distancia_km, sol_valor_estimado, sol_status, sol_created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente', NOW())",
        [emp_codigo, usu_codigo, sol_origem, sol_destino, sol_forma_pagamento, sol_distancia_km, sol_valor_estimado]
    );
    return result;
};

export const getRequestById = async (sol_codigo) => {
    const [result] = await db.query(
        "SELECT * FROM solicitacoes WHERE sol_codigo = ?",
        [sol_codigo]
    );
    return result;
};

export const cancelRequest = async (sol_codigo) => {
    const [result] = await db.query(
        "UPDATE solicitacoes SET sol_status = 'cancelada' WHERE sol_codigo = ?",
        [sol_codigo]
    );
    return result;
};

export const getTravelIdByRequestId = async (sol_codigo) => {
    const [result] = await db.query(
        "SELECT via_codigo FROM viagens WHERE sol_codigo = ?",
        [sol_codigo]
    );
    return result[0] ? result[0].via_codigo : null;
}

export const getRequests = async (ate_codigo) => {
    const [rows] = await db.query(
        // "SELECT s.*, u.usu_nome FROM solicitacoes s, usuarios u WHERE s.usu_codigo = u.usu_codigo AND emp_codigo = ? ORDER BY sol_created_at DESC",
        `SELECT s.*, u.usu_nome, a.ate_codigo, e.emp_codigo FROM solicitacoes s 
            INNER JOIN usuarios u ON s.usu_codigo = u.usu_codigo 
            INNER JOIN empresas e ON s.emp_codigo = e.emp_codigo 
            INNER JOIN atendentes a ON a.emp_codigo = e.emp_codigo 
            WHERE a.ate_codigo = ? ORDER BY s.sol_created_at DESC 
        `, [ate_codigo]
    );
    return rows;
}
export const acceptRequest = async (sol_codigo, mot_codigo, ate_codigo) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(
            "SELECT sol_status FROM solicitacoes WHERE sol_codigo = ? FOR UPDATE",
            [sol_codigo]
        );

        if (rows.length === 0) {
            throw new Error("Solicitação não encontrada");
        }

        const status = rows[0].sol_status;

        if (status === "aceito") {
            throw new Error("Solicitação já foi aceita por outro atendente");
        }

        if (status === "recusado") {
            throw new Error("Solicitação já foi recusada");
        }

        if (status !== "pendente") {
            throw new Error("Solicitação não está disponível para aceitação");
        }

        await connection.query(
            "UPDATE solicitacoes SET sol_status = 'aceito' WHERE sol_codigo = ?",
            [sol_codigo]
        );

        await connection.query(
            "UPDATE mototaxistas SET mot_status = 'indisponível' WHERE mot_codigo = ?",
            [mot_codigo]
        );

        const [solRows] = await connection.query(
            "SELECT * FROM solicitacoes WHERE sol_codigo = ?",
            [sol_codigo]
        );

        const solicitacao = solRows[0];

        const [insertViagem] = await connection.query(
            `
            INSERT INTO viagens (
                sol_codigo,
                emp_codigo,
                mot_codigo,
                via_valor_final,
                via_status,
                via_data_inicio,
                ate_codigo
            ) VALUES (?, ?, ?, ?, ?, NOW(), ?)
            `,
            [
                solicitacao.sol_codigo,
                solicitacao.emp_codigo,
                mot_codigo,
                solicitacao.sol_valor_estimado,
                "EM_ANDAMENTO",
                ate_codigo
            ]
        );

        await connection.commit();

        return {
            message: "Solicitação aceita! Viagem iniciada.",
            via_codigo: insertViagem.insertId,
            solicitacao
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
export const refuseRequest = async (sol_codigo) => {

    const [rows] = await db.query(
        "SELECT sol_status FROM solicitacoes WHERE sol_codigo = ?",
        [sol_codigo]
    );

    if (rows.length === 0) {
        throw new Error("Solicitação não encontrada");
    }

    const status = rows[0].sol_status;

    if (status === "aceito") {
        throw new Error("Solicitação já foi aceita e não pode ser recusada");
    }

    if (status === "recusado") {
        throw new Error("Solicitação já foi recusada");
    }

    if (status !== "pendente") {
        throw new Error("Solicitação não pode ser recusada");
    }

    await db.query(
        "UPDATE solicitacoes SET sol_status = 'recusado' WHERE sol_codigo = ?",
        [sol_codigo]
    );

    return {
        message: "Solicitação recusada com sucesso"
    };
};

