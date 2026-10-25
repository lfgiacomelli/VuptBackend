import { db } from "../db/db.js";



export const getCompanies = async () => {
    const [rows] = await db.query(
        `
        SELECT
            e.*,
            ee.end_cep,
            ee.end_logradouro,
            ee.end_numero,
            ee.end_bairro,
            ee.end_cidade,
            ee.end_estado,
            ee.end_complemento
        FROM empresas e
        LEFT JOIN empresas_enderecos ee
            ON ee.emp_codigo = e.emp_codigo
        ORDER BY e.emp_nome;
        `,
    );
    if (rows.length === 0) {
        throw new Error('Nenhuma empresa cadastrada no sistema');
    }
    return rows;
};

export const createCompany = async (company) => {
    const {
        emp_nome,
        emp_email,
        emp_cnpj,
        emp_telefone,
        emp_logotipo,

        end_cidade,
        end_logradouro,
        end_cep,
        end_bairro,
        end_numero,
        end_estado,
        end_complemento
    } = company;

    const [rows] = await db.query(
        'SELECT emp_codigo FROM empresas WHERE emp_cnpj = ? LIMIT 1',
        [emp_cnpj]
    );

    if (rows.length > 0) {
        throw new Error('CNPJ já cadastrado, tente outro');
    }

    const [companyResult] = await db.query(
        `
        INSERT INTO empresas (
            emp_nome,
            emp_email,
            emp_cnpj,
            emp_telefone,
            emp_logotipo,
            emp_created_at,
            emp_updated_at
        )
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `,
        [
            emp_nome,
            emp_email,
            emp_cnpj,
            emp_telefone,
            emp_logotipo
        ]
    );

    const emp_codigo = companyResult.insertId;

    await db.query(
        `
        INSERT INTO empresas_enderecos (
            emp_codigo,
            end_cidade,
            end_logradouro,
            end_cep,
            end_bairro,
            end_numero,
            end_estado,
            end_complemento,
            end_created_at,
            end_updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `,
        [
            emp_codigo,
            end_cidade,
            end_logradouro,
            end_cep,
            end_bairro,
            end_numero,
            end_estado,
            end_complemento
        ]
    );

    return {
        emp_codigo,
        ...company
    };
};

export const updateCompany = async (emp_codigo, updateData) => {
    const companyFields = [];
    const companyValues = [];

    const addressFields = [];
    const addressValues = [];

    for (const key in updateData) {
        if (key.startsWith("end_")) {
            addressFields.push(`${key} = ?`);
            addressValues.push(updateData[key]);
        } else {
            companyFields.push(`${key} = ?`);
            companyValues.push(updateData[key]);
        }
    }

    if (companyFields.length > 0) {
        companyFields.push("emp_updated_at = ?");
        companyValues.push(new Date());

        companyValues.push(emp_codigo);

        await db.query(
            `UPDATE empresas
             SET ${companyFields.join(", ")}
             WHERE emp_codigo = ?`,
            companyValues
        );
    }

    if (addressFields.length > 0) {
        addressValues.push(emp_codigo);

        await db.query(
            `UPDATE empresas_enderecos
             SET ${addressFields.join(", ")}
             WHERE emp_codigo = ?`,
            addressValues
        );
    }

    return {
        message: "Empresa atualizada com sucesso!"
    };
};

export const addFirstAttendantToCompany = async (emp_codigo, attendant) => {
    const { ate_nome, ate_email, ate_senha } = attendant;

    const existingAttendant = await db.query(
        'SELECT ate_codigo FROM atendentes WHERE ate_email = ? LIMIT 1',
        [ate_email]
    );

    if (existingAttendant.length > 0) {
        throw new Error('Esta empresa já possui um atendente cadastrado');
    }

    const [result] = await db.query(
        'INSERT INTO atendentes (ate_nome, ate_email, ate_senha, emp_codigo, ate_created_at, ate_updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [ate_nome, ate_email, ate_senha, emp_codigo]
    );

    return { ate_codigo: result.insertId, ate_nome, ate_email, emp_codigo };
};

export const deleteCompany = async (emp_codigo) => {
    const [result] = await db.query(
        "UPDATE empresas SET emp_status = 'INATIVA' WHERE emp_codigo = ?",
        [emp_codigo]
    );
    return { message: "Empresa desativada com sucesso!", affectedRows: result.affectedRows };
};

export const getAvailableCompanies = async (city) => {
    const [rows] = await db.query(
        `
        SELECT 
            e.*, 
            ee.*
        FROM empresas e, empresas_enderecos ee
            WHERE LOWER(end_cidade) = LOWER(?)
                AND emp_status = 'ativa'
                AND e.emp_codigo = ee.emp_codigo
            ORDER BY RAND()
        LIMIT 10
        `,
        [city]
    );

    return rows;
};

export const getCompanyById = async (emp_codigo) => {
    const [rows] = await db.query(
        `SELECT 
            e.*, 
            ee.* 
        FROM empresas e, empresas_enderecos ee 
        WHERE e.emp_codigo = ?`,
        [emp_codigo]
    );

    const [rowsAttributes] = await db.query(
        `SELECT 
            atr_codigo, 
            atr_valor_fixo, 
            atr_valor_km 
        FROM atributos 
        WHERE emp_codigo = ?`,
        [emp_codigo]
    );

    const [rowsAverage] = await db.query(
        `
        SELECT 
            ROUND(AVG(a.ava_nota), 1) AS media_avaliacoes,
            COUNT(a.ava_codigo) AS total_avaliacoes
        FROM viagens v
            LEFT JOIN avaliacoes a ON a.via_codigo = v.via_codigo
        WHERE v.emp_codigo = ?
        `,
        [emp_codigo]
    );

    return {
        ...rows[0],
        atributos: rowsAttributes,
        avaliacao: rowsAverage[0]
    };
};


export const getPopularCompanies = async (city) => {
    const [rows] = await db.query(
        `
        SELECT
            e.*,
            ee.end_cidade,
            COUNT(DISTINCT v.via_codigo) AS total_viagens
        FROM empresas e
        INNER JOIN empresas_enderecos ee
            ON ee.emp_codigo = e.emp_codigo
        INNER JOIN viagens v
            ON v.emp_codigo = e.emp_codigo
        WHERE LOWER(ee.end_cidade) = LOWER(?)
            AND e.emp_status = 'ativa'
            AND v.via_data_inicio >= CURDATE()
            AND v.via_data_inicio < CURDATE() + INTERVAL 1 DAY
        GROUP BY e.emp_codigo
        HAVING COUNT(DISTINCT v.via_codigo) > 1
        ORDER BY RAND()
        LIMIT 5;
        `,
        [city]
    );

    // console.log("Cidade:", city);
    // console.log("Empresas encontradas:", rows.length);

    return rows;
};
