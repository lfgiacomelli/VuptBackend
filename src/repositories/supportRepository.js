import { db } from "../db/db.js";


export const getSupportById = async (sup_codigo) => {
    const [rows] = await db.query(
        `
        SELECT
            s.*,

            e.emp_nome,
            e.emp_email,
            e.emp_telefone,
            ee.end_cidade,

            u.usu_nome,
            u.usu_email,

            a.ate_nome,
            a.ate_email
        FROM suportes s
        INNER JOIN empresas e
            ON e.emp_codigo = s.emp_codigo
        INNER JOIN usuarios u
            ON u.usu_codigo = s.usu_codigo
        LEFT JOIN atendentes a
            ON a.ate_codigo = s.ate_codigo

        LEFT JOIN empresas_enderecos ee
            ON ee.emp_codigo = e.emp_codigo
        WHERE s.sup_codigo = ?
        LIMIT 1
        `,
        [sup_codigo]
    );

    return rows[0] || null;
};

export const deleteSupport = async (sup_codigo) => {
    const [result] = await db.query(
        `DELETE FROM suportes WHERE sup_codigo = ?`,
        [sup_codigo]
    );

    return {
        success: true,
        message: "Chamado deletado com sucesso",
        affectedRows: result.affectedRows
    };
};

export const updateSupportDetails = async (sup_codigo, updateData) => {
    const allowedFields = [
        "sup_motivo",
        "sup_descricao"
    ];

    const fields = [];
    const values = [];

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

    fields.push("sup_updated_at = NOW()");
    values.push(sup_codigo);

    const query = `
        UPDATE suportes
        SET ${fields.join(", ")}
        WHERE sup_codigo = ?
    `;

    const [result] = await db.query(query, values);

    return {
        success: true,
        message: "Chamado atualizado com sucesso",
        affectedRows: result.affectedRows
    };
};

export const createSupport = async (support) => {
    const {
        emp_codigo,
        usu_codigo,
        via_codigo,
        sup_motivo,
        sup_descricao
    } = support;

    const [companyRows] = await db.query(
        `SELECT emp_codigo FROM empresas WHERE emp_codigo = ? LIMIT 1`,
        [emp_codigo]
    );

    if (companyRows.length === 0) {
        throw new Error("Empresa não encontrada");
    }

    const [userRows] = await db.query(
        `SELECT usu_codigo FROM usuarios WHERE usu_codigo = ? LIMIT 1`,
        [usu_codigo]
    );

    if (userRows.length === 0) {
        throw new Error("Usuário não encontrado");
    }

    const [travelRows] = await db.query(
        `SELECT via_codigo, emp_codigo FROM viagens WHERE via_codigo = ? LIMIT 1`,
        [via_codigo]
    );

    if (travelRows.length === 0) {
        throw new Error("Viagem não encontrada");
    }

    if (travelRows[0].emp_codigo !== Number(emp_codigo)) {
        throw new Error("A viagem não pertence à empresa informada");
    }

    const [result] = await db.query(
        `
        INSERT INTO suportes (
            emp_codigo,
            usu_codigo,
            via_codigo,
            sup_motivo,
            sup_descricao,
            sup_status,
            sup_created_at,
            sup_updated_at
        ) VALUES (?, ?, ?, ?, ?, 'aberto', NOW(), NOW())
        `,
        [
            emp_codigo,
            usu_codigo,
            via_codigo,
            sup_motivo,
            sup_descricao ?? null
        ]
    );

    return await getSupportById(result.insertId);
};

export const getSupportsByUser = async (usu_codigo) => {
    const [rows] = await db.query(
        `
        SELECT
            s.sup_codigo,
            s.emp_codigo,
            s.usu_codigo,
            s.ate_codigo,
            s.sup_motivo,
            s.sup_descricao,
            s.sup_status,
            s.sup_created_at,
            s.sup_updated_at,
            s.sup_finalizado_at,

            e.emp_nome,
            ee.end_cidade,
            e.emp_telefone,

            a.ate_nome
        FROM suportes s
        INNER JOIN empresas e
            ON e.emp_codigo = s.emp_codigo
        LEFT JOIN atendentes a
            ON a.ate_codigo = s.ate_codigo
        LEFT JOIN empresas_enderecos ee
            ON ee.emp_codigo = e.emp_codigo
        WHERE s.usu_codigo = ?
        ORDER BY s.sup_created_at DESC
        `,
        [usu_codigo]
    );

    return rows;
};

export const getOpenSupportByUserAndCompany = async (usu_codigo, emp_codigo) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM suportes
        WHERE usu_codigo = ?
          AND emp_codigo = ?
          AND sup_status IN ('aberto', 'em_atendimento')
        ORDER BY sup_created_at DESC
        LIMIT 1
        `,
        [usu_codigo, emp_codigo]
    );

    return rows[0] || null;
};

export const cancelSupportByUser = async (sup_codigo, usu_codigo) => {
    const support = await getSupportById(sup_codigo);

    if (!support) {
        throw new Error("Chamado não encontrado");
    }

    if (support.usu_codigo !== usu_codigo) {
        throw new Error("Você não tem permissão para cancelar este chamado");
    }

    if (support.sup_status !== "aberto") {
        throw new Error("Somente chamados abertos podem ser cancelados pelo usuário");
    }

    const [result] = await db.query(
        `
        UPDATE suportes
        SET
            sup_status = 'cancelado',
            sup_updated_at = NOW()
        WHERE sup_codigo = ?
        `,
        [sup_codigo]
    );

    return {
        success: true,
        message: "Chamado cancelado com sucesso",
        affectedRows: result.affectedRows
    };
};



export const getSupportsByCompany = async (emp_codigo) => {
    const [rows] = await db.query(
        `
        SELECT
            s.sup_codigo,
            s.emp_codigo,
            s.usu_codigo,
            s.ate_codigo,
            s.sup_motivo,
            s.sup_descricao,
            s.sup_status,
            s.sup_created_at,
            s.sup_updated_at,
            s.sup_finalizado_at,

            u.usu_nome,
            u.usu_email,

            a.ate_nome
        FROM suportes s
        INNER JOIN usuarios u
            ON u.usu_codigo = s.usu_codigo
        LEFT JOIN atendentes a
            ON a.ate_codigo = s.ate_codigo
        WHERE s.emp_codigo = ?
        ORDER BY
            CASE
                WHEN s.sup_status = 'aberto' THEN 1
                WHEN s.sup_status = 'em_atendimento' THEN 2
                WHEN s.sup_status = 'finalizado' THEN 3
                WHEN s.sup_status = 'cancelado' THEN 4
            END,
            s.sup_created_at DESC
        `,
        [emp_codigo]
    );

    return rows;
};

export const getOpenSupportsByCompany = async (emp_codigo) => {
    const [rows] = await db.query(
        `
        SELECT
            s.sup_codigo,
            s.emp_codigo,
            s.usu_codigo,
            s.ate_codigo,
            s.sup_motivo,
            s.sup_descricao,
            s.sup_status,
            s.sup_created_at,
            s.sup_updated_at,
            s.sup_finalizado_at,

            u.usu_nome,
            u.usu_email,
        FROM suportes s
        INNER JOIN usuarios u
            ON u.usu_codigo = s.usu_codigo
        WHERE s.emp_codigo = ?
          AND s.sup_status = 'aberto'
        ORDER BY s.sup_created_at ASC
        `,
        [emp_codigo]
    );

    return rows;
};

export const getAvailablesTravelsToSupport = async (usu_codigo) => {
    const [rows] = await db.query(
        `
        SELECT 
            v.via_codigo,
            v.via_status,
            v.via_data_inicio,
            v.via_valor_final,
            s.sol_codigo,
            s.sol_origem,
            s.sol_destino,
            s.usu_codigo,
            s.emp_codigo,
            e.emp_nome
        FROM viagens v
        INNER JOIN solicitacoes s ON s.sol_codigo = v.sol_codigo
        INNER JOIN empresas e ON e.emp_codigo = s.emp_codigo
        WHERE s.usu_codigo = ?
          AND v.via_status = 'FINALIZADA'
        ORDER BY v.via_data_inicio DESC
        `,
        [usu_codigo]
    );

    return rows;
};

export const getSupportsInAttendanceByAttendant = async (ate_codigo) => {
    const [rows] = await db.query(
        `
        SELECT
            s.sup_codigo,
            s.emp_codigo,
            s.usu_codigo,
            s.ate_codigo,
            s.sup_motivo,
            s.sup_descricao,
            s.sup_status,
            s.sup_created_at,
            s.sup_updated_at,
            s.sup_finalizado_at,

            e.emp_nome,

            u.usu_nome,
            u.usu_email,
        FROM suportes s
        INNER JOIN empresas e
            ON e.emp_codigo = s.emp_codigo
        INNER JOIN usuarios u
            ON u.usu_codigo = s.usu_codigo
        WHERE s.ate_codigo = ?
          AND s.sup_status = 'em_atendimento'
        ORDER BY s.sup_updated_at DESC
        `,
        [ate_codigo]
    );

    return rows;
};

export const acceptSupport = async (sup_codigo, ate_codigo) => {
    const support = await getSupportById(sup_codigo);

    if (!support) {
        throw new Error("Chamado não encontrado");
    }

    if (support.sup_status !== "aberto") {
        throw new Error("Esse chamado não está disponível para atendimento");
    }

    const [attendantRows] = await db.query(
        `
        SELECT ate_codigo, emp_codigo
        FROM atendentes
        WHERE ate_codigo = ?
        LIMIT 1
        `,
        [ate_codigo]
    );

    if (attendantRows.length === 0) {
        throw new Error("Atendente não encontrado");
    }

    const attendant = attendantRows[0];

    if (attendant.emp_codigo !== support.emp_codigo) {
        throw new Error("Este atendente não pertence à empresa do chamado");
    }

    const [result] = await db.query(
        `
        UPDATE suportes
        SET
            ate_codigo = ?,
            sup_status = 'em_atendimento',
            sup_updated_at = NOW()
        WHERE sup_codigo = ?
        `,
        [ate_codigo, sup_codigo]
    );

    return {
        success: true,
        message: "Chamado aceito com sucesso",
        affectedRows: result.affectedRows
    };
};

export const finishSupport = async (sup_codigo, ate_codigo) => {
    const support = await getSupportById(sup_codigo);

    if (!support) {
        throw new Error("Chamado não encontrado");
    }

    if (support.ate_codigo !== ate_codigo) {
        throw new Error("Apenas o atendente responsável pode finalizar este chamado");
    }

    if (support.sup_status === "finalizado") {
        throw new Error("Esse chamado já foi finalizado");
    }

    if (support.sup_status === "cancelado") {
        throw new Error("Esse chamado foi cancelado");
    }

    const [result] = await db.query(
        `
        UPDATE suportes
        SET
            sup_status = 'finalizado',
            sup_finalizado_at = NOW(),
            sup_updated_at = NOW()
        WHERE sup_codigo = ?
        `,
        [sup_codigo]
    );

    return {
        success: true,
        message: "Chamado finalizado com sucesso",
        affectedRows: result.affectedRows
    };
};

export const cancelSupportByAttendant = async (sup_codigo, ate_codigo) => {
    const support = await getSupportById(sup_codigo);

    if (!support) {
        throw new Error("Chamado não encontrado");
    }

    if (support.ate_codigo !== ate_codigo) {
        throw new Error("Apenas o atendente responsável pode cancelar este chamado");
    }

    if (support.sup_status !== "em_atendimento") {
        throw new Error("Somente chamados em atendimento podem ser cancelados pelo atendente");
    }

    const [result] = await db.query(
        `
        UPDATE suportes
        SET
            sup_status = 'cancelado',
            sup_updated_at = NOW()
        WHERE sup_codigo = ?
        `,
        [sup_codigo]
    );

    return {
        success: true,
        message: "Chamado cancelado com sucesso",
        affectedRows: result.affectedRows
    };
};


export const getSupportsByStatusAndCompany = async (emp_codigo, sup_status) => {
    const [rows] = await db.query(
        `
        SELECT
            s.*,
            u.usu_nome,
            u.usu_email,
            a.ate_nome
        FROM suportes s
        INNER JOIN usuarios u
            ON u.usu_codigo = s.usu_codigo
        LEFT JOIN atendentes a
            ON a.ate_codigo = s.ate_codigo
        WHERE s.emp_codigo = ?
          AND s.sup_status = ?
        ORDER BY s.sup_created_at DESC
        `,
        [emp_codigo, sup_status]
    );

    return rows;
};

export const getSupportsCountByCompany = async (emp_codigo) => {
    const [rows] = await db.query(
        `
        SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN sup_status = 'aberto' THEN 1 ELSE 0 END) AS abertos,
            SUM(CASE WHEN sup_status = 'em_atendimento' THEN 1 ELSE 0 END) AS em_atendimento,
            SUM(CASE WHEN sup_status = 'finalizado' THEN 1 ELSE 0 END) AS finalizados,
            SUM(CASE WHEN sup_status = 'cancelado' THEN 1 ELSE 0 END) AS cancelados
        FROM suportes
        WHERE emp_codigo = ?
        `,
        [emp_codigo]
    );

    return rows[0];
};