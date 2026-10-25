import { db } from "../db/db.js";

export const getAvailablesByUser = async (usu_codigo) => {
    const [result] = await db.query(
        `SELECT * FROM avaliacoes WHERE usu_codigo = ? ORDER BY created_at DESC`,
        [usu_codigo]
    );

    return result;
};

export const createAvailable = async (data) => {
    const {
        usu_codigo,
        via_codigo,
        ava_comentario,
        ava_nota
    } = data;

    const [result] = await db.query(
        `INSERT INTO avaliacoes 
        (usu_codigo, via_codigo, ava_comentario, ava_nota, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [usu_codigo, via_codigo, ava_comentario, ava_nota]
    );

    return {
        ava_codigo: result.insertId,
        ...data
    };
};

export const getAvailablesToExplain = async () => {
    const [result] = await db.query(
        `SELECT a.*, u.usu_nome FROM avaliacoes a, usuarios u WHERE a.usu_codigo = u.usu_codigo AND ava_comentario != "" AND ava_nota > 3 ORDER BY created_at DESC LIMIT 10`
    );
    return result;
    
}