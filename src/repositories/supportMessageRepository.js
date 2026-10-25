import { db } from "../db/db.js";

export const createSupportMessage = async (messageData) => {
    const {
        sup_codigo,
        remetente_tipo,
        remetente_codigo,
        msg_texto
    } = messageData;

    const [result] = await db.query(
        `INSERT INTO suporte_mensagens (
            sup_codigo,
            remetente_tipo,
            remetente_codigo,
            msg_texto,
            msg_lida,
            msg_created_at,
            msg_updated_at
        ) VALUES (?, ?, ?, ?, 0, NOW(), NOW())`,
        [
            sup_codigo,
            remetente_tipo,
            remetente_codigo,
            msg_texto
        ]
    );

    const [rows] = await db.query(
        `SELECT * FROM suporte_mensagens WHERE msg_codigo = ?`,
        [result.insertId]
    );

    return rows[0];
};

export const getSupportMessagesBySupport = async (sup_codigo) => {
    const [rows] = await db.query(
        `SELECT *
         FROM suporte_mensagens
         WHERE sup_codigo = ?
         ORDER BY msg_created_at ASC`,
        [sup_codigo]
    );

    return rows;
};

export const getSupportMessageById = async (msg_codigo) => {
    const [rows] = await db.query(
        `SELECT * FROM suporte_mensagens WHERE msg_codigo = ?`,
        [msg_codigo]
    );

    return rows[0] || null;
};

export const markSupportMessagesAsRead = async (sup_codigo, remetente_tipo) => {
    const [result] = await db.query(
        `UPDATE suporte_mensagens
         SET msg_lida = 1,
             msg_updated_at = NOW()
         WHERE sup_codigo = ?
           AND remetente_tipo <> ?
           AND msg_lida = 0`,
        [sup_codigo, remetente_tipo]
    );

    return {
        message: "Mensagens marcadas como lidas com sucesso",
        affectedRows: result.affectedRows
    };
};