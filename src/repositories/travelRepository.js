import { db } from "../db/db.js";

export const getTravelsByUser = async (usu_codigo) => {
    const [result] = await db.query(
        `SELECT 
    v.*,

    s.usu_codigo,
    s.sol_origem,
    s.sol_destino,

    e.emp_nome,

    m.mot_nome,
    mo.moto_modelo,

    a.ava_codigo,
    a.ava_nota,
    a.ava_comentario,

    CASE 
        WHEN a.ava_codigo IS NOT NULL THEN true 
        ELSE false 
    END AS avaliado

FROM viagens v

LEFT JOIN solicitacoes s 
    ON s.sol_codigo = v.sol_codigo

LEFT JOIN empresas e 
    ON e.emp_codigo = v.emp_codigo

LEFT JOIN mototaxistas m 
    ON m.mot_codigo = v.mot_codigo

LEFT JOIN motocicletas mo 
    ON mo.mot_codigo = v.mot_codigo

LEFT JOIN avaliacoes a 
    ON a.via_codigo = v.via_codigo

WHERE s.usu_codigo = ?

ORDER BY v.via_data_inicio DESC;;`,
        [usu_codigo]
    );

    return result;
};

export const getTravelById = async (via_codigo) => {
    const [rows] = await db.query(
        `
            SELECT
    v.via_codigo,
    v.sol_codigo,
    v.emp_codigo,
    v.mot_codigo,
    v.via_status,
    v.via_data_inicio,
    v.via_data_fim,

    s.sol_origem,
    s.sol_destino,
    s.sol_distancia_km,
    s.sol_valor_estimado,
    s.sol_forma_pagamento,
    s.sol_status,

    e.emp_nome,
    e.emp_logotipo,
    ee.end_cidade,

    m.mot_nome,
    m.mot_telefone,
    m.mot_email,
    m.mot_status,

    moto.moto_codigo,
    moto.moto_modelo,
    moto.moto_marca,
    moto.moto_placa,
    moto.moto_ano,

    a.ava_codigo,
    a.ava_nota,
    a.ava_comentario
        FROM viagens v

        LEFT JOIN solicitacoes s
            ON s.sol_codigo = v.sol_codigo

        LEFT JOIN empresas e
            ON e.emp_codigo = v.emp_codigo

        LEFT JOIN empresas_enderecos ee
            ON ee.emp_codigo = e.emp_codigo

        LEFT JOIN mototaxistas m
            ON m.mot_codigo = v.mot_codigo

        LEFT JOIN motocicletas moto
            ON moto.mot_codigo = v.mot_codigo

        LEFT JOIN avaliacoes a
            ON a.via_codigo = v.via_codigo

        WHERE v.via_codigo = ?
        LIMIT 1
        `,
        [via_codigo]
    );

    if (!rows.length) return null;

    const row = rows[0];

    return {
        viagem: {
            via_codigo: row.via_codigo,
            emp_codigo: row.emp_codigo,
            emp_nome: row.emp_nome,
            emp_logotipo: row.emp_logotipo,
            mot_codigo: row.mot_codigo,
            via_status: row.via_status,
            via_valor: row.via_valor,
            via_distancia: row.via_distancia,
            via_created_at: row.via_created_at,
            ava_codigo: row.ava_codigo,
            ava_nota: row.ava_nota,
            ava_comentario: row.ava_comentario,
            sol_origem: row.sol_origem,
            sol_destino: row.sol_destino,
            sol_distancia_km: row.sol_distancia_km,
            sol_valor_estimado: row.sol_valor_estimado,
            sol_forma_pagamento: row.sol_forma_pagamento,
            via_data_inicio: row.via_data_inicio,
            via_data_fim: row.via_data_fim
        },
        empresa: {
            emp_codigo: row.emp_codigo,
            emp_nome: row.emp_nome,
            end_cidade: row.end_cidade,
        },
        mototaxista: {
            mot_codigo: row.mot_codigo,
            mot_nome: row.mot_nome,
            mot_telefone: row.mot_telefone,
            mot_email: row.mot_email,
            mot_status: row.mot_status,
        },
        motocicleta: {
            moto_codigo: row.moto_codigo,
            moto_modelo: row.moto_modelo,
            moto_marca: row.moto_marca,
            moto_placa: row.moto_placa,
            moto_ano: row.moto_ano,
        }
    };

};

export const getMotorcycle = async (via_codigo) => {
    if (!via_codigo) {
        throw new Error("viaCodigo é obrigatório");
    }
    try {
        const query = `
            SELECT 
                m.mot_codigo,
                m.mot_nome,
                mo.moto_modelo,
                mo.moto_placa
            FROM mototaxistas m
                INNER JOIN viagens v 
                    ON v.mot_codigo = m.mot_codigo
                INNER JOIN motocicletas mo 
                    ON mo.mot_codigo = m.mot_codigo
            WHERE v.via_codigo = ?
                LIMIT 1;
        `;

        const [rows] = await db.query(query, [via_codigo]);

        if (!rows || rows.length === 0) {
            return null;
        }

        return rows[0];

    } catch (error) {
        console.error("Erro ao buscar mototaxista da viagem:", error);
        throw new Error("Erro ao buscar mototaxista");
    }
};


export const getActiveTravel = async (usu_codigo) => {
    const [rows] = await db.query(
        `SELECT
            v.via_codigo,
            v.via_status,
            v.via_valor_final,
            s.sol_origem,
            s.sol_destino,
            m.mot_nome,
            moto.moto_modelo
        FROM viagens v
            INNER JOIN solicitacoes s
                ON s.sol_codigo = v.sol_codigo

        LEFT JOIN mototaxistas m 
            ON v.mot_codigo = m.mot_codigo

        LEFT JOIN motocicletas moto
            ON m.mot_codigo = moto.mot_codigo
        WHERE s.usu_codigo = ?
            AND s.sol_status = 'aceito' AND v.via_status = 'EM_ANDAMENTO'
        ORDER BY v.via_data_inicio DESC
            LIMIT 1;
        `,
        [usu_codigo]
    );

    return rows[0] || null;
};
export const getOriginAndDestination = async (via_codigo) => {
    const [result] = await db.query(
        `
        SELECT 
            s.sol_origem, 
            s.sol_destino,
            v.sol_codigo
        FROM viagens v
        INNER JOIN solicitacoes s 
            ON s.sol_codigo = v.sol_codigo
        WHERE v.via_codigo = ?
        LIMIT 1;
        `,
        [via_codigo]
    );

    return result[0] || null;
};

export const finishTravel = async (via_codigo) => {

    const [rows] = await db.query(
        `
            SELECT 
                via_status, 
                mot_codigo 
            FROM viagens 
            WHERE via_codigo = ?
        `,
        [via_codigo]
    );

    if (rows.length === 0) {
        throw new Error("Viagem não encontrada");
    }

    const viagem = rows[0];

    if (viagem.via_status === "FINALIZADA") {
        throw new Error("Viagem já foi finalizada");
    }

    await db.query(
        "UPDATE viagens SET via_status = 'FINALIZADA', via_data_fim = NOW() WHERE via_codigo = ?",
        [via_codigo]
    );

    await db.query(
        "UPDATE mototaxistas SET mot_status = 'disponível'  WHERE mot_codigo = ?",
        [viagem.mot_codigo]
    );

    return {
        message: "Viagem finalizada com sucesso"
    };
};

export const getTravels = async (emp_codigo) => {
    const [rows] = await db.query(
        `
        SELECT 
            v.*,
            s.*
            FROM viagens v
            JOIN solicitacoes s 
                ON s.sol_codigo = v.sol_codigo
            WHERE v.emp_codigo = ?
            ORDER BY v.via_data_inicio DESC;
`,
        [emp_codigo]
    );
    return rows;
}


