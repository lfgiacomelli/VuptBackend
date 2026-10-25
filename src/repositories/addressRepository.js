import { db } from "../db/db.js";

export const createAddress = async (address) => {
    const {
        usu_codigo,
        end_apelido,
        end_cep,
        end_logradouro,
        end_numero,
        end_bairro,
        end_cidade,
        end_uf,
        end_complemento,
        end_referencia
    } = address;

    const [countRows] = await db.query(
        "SELECT COUNT(*) AS total FROM enderecos_favoritos WHERE usu_codigo = ?",
        [usu_codigo]
    );

    if (countRows[0].total >= 5) {
        throw new Error("Limite máximo de 5 endereços atingido.");
    }

    const [result] = await db.query(
        `INSERT INTO enderecos_favoritos (
            usu_codigo,
            end_apelido,
            end_cep,
            end_logradouro,
            end_numero,
            end_bairro,
            end_cidade,
            end_uf,
            end_complemento,
            end_referencia,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
            usu_codigo,
            end_apelido,
            end_cep,
            end_logradouro,
            end_numero,
            end_bairro,
            end_cidade,
            end_uf,
            end_complemento || null,
            end_referencia || null
        ]
    );

    return {
        end_codigo: result.insertId,
        usu_codigo,
        end_apelido,
        end_cep,
        end_logradouro,
        end_numero,
        end_bairro,
        end_cidade,
        end_uf,
        end_complemento,
        end_referencia
    };
};

export const updateAddress = async (end_codigo, updateData) => {
    const allowedFields = [
        "end_apelido",
        "end_cep",
        "end_logradouro",
        "end_numero",
        "end_bairro",
        "end_cidade",
        "end_uf",
        "end_complemento",
        "end_referencia"
    ];

    const fields = [];
    const values = [];

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(updateData[field]);
        }
    }

    if (!fields.length) {
        return { message: "Nenhum dado para atualizar" };
    }

    fields.push("updated_at = ?");
    values.push(new Date());
    values.push(end_codigo);

    const query = `
        UPDATE enderecos_favoritos
        SET ${fields.join(", ")}
        WHERE end_codigo = ?
    `;

    const [result] = await db.query(query, values);

    return {
        message: "Endereço atualizado com sucesso",
        affectedRows: result.affectedRows
    };
};

export const deleteAddress = async (end_codigo) => {
    const [result] = await db.query(
        "DELETE FROM enderecos_favoritos WHERE end_codigo = ?",
        [end_codigo]
    );

    return {
        message: "Endereço removido com sucesso",
        affectedRows: result.affectedRows
    };
};

export const getAddressById = async (end_codigo) => {
    const [rows] = await db.query(
        "SELECT * FROM enderecos_favoritos WHERE end_codigo = ?",
        [end_codigo]
    );

    return rows[0] || null;
};

export const getAddressesByUser = async (usu_codigo) => {
    const [rows] = await db.query(
        "SELECT * FROM enderecos_favoritos WHERE usu_codigo = ? ORDER BY created_at DESC",
        [usu_codigo]
    );

    return rows;
};