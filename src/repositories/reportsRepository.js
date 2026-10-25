import { db } from "../db/db.js";

export const ReportsRepository = {

    async getGeneralMetrics(emp_codigo) {
        const [rows] = await db.query(`
            SELECT 
                COUNT(DISTINCT v.via_codigo) AS total_viagens,
                SUM(v.via_valor_final) AS faturamento_total,
                AVG(a.ava_nota) AS media_avaliacoes,
                COUNT(DISTINCT s.sol_codigo) AS total_solicitacoes,
                COUNT(DISTINCT CASE WHEN s.sol_status = 'cancelado' THEN s.sol_codigo END) AS total_canceladas
            FROM viagens v
            LEFT JOIN solicitacoes s ON v.sol_codigo = s.sol_codigo
            LEFT JOIN avaliacoes a ON v.via_codigo = a.via_codigo
            WHERE v.emp_codigo = ?
        `, [emp_codigo]);

        return rows[0];
    },
    async getRevenueByDay(emp_codigo) {
        const [rows] = await db.query(`
            SELECT 
                DATE(v.via_data_inicio) AS data,
                SUM(v.via_valor_final) AS faturamento
            FROM viagens v
            WHERE v.emp_codigo = ?
            GROUP BY DATE(v.via_data_inicio)
            ORDER BY data ASC
        `, [emp_codigo]);

        return rows;
    },

    async getTripsReport(emp_codigo) {
        const [rows] = await db.query(`
            SELECT 
                v.via_codigo,
                v.via_valor_final,
                v.via_status,
                v.via_data_inicio,
                v.via_data_fim,
                m.mot_nome,
                s.sol_origem,
                s.sol_destino
            FROM viagens v
            JOIN mototaxistas m ON v.mot_codigo = m.mot_codigo
            JOIN solicitacoes s ON v.sol_codigo = s.sol_codigo
            WHERE v.emp_codigo = ?
            ORDER BY v.via_data_inicio DESC
        `, [emp_codigo]);

        return rows;
    },

    async getRequestsReport(emp_codigo) {
        const [rows] = await db.query(`
            SELECT 
                sol_status,
                COUNT(*) AS total
            FROM solicitacoes
            WHERE emp_codigo = ?
            GROUP BY sol_status
        `, [emp_codigo]);

        return rows;
    },

    async getTopDrivers(emp_codigo) {
        const [rows] = await db.query(`
            SELECT 
                m.mot_codigo,
                m.mot_nome,
                COUNT(v.via_codigo) AS total_viagens,
                AVG(a.ava_nota) AS media_avaliacao,
                SUM(v.via_valor_final) AS faturamento
            FROM mototaxistas m
            LEFT JOIN viagens v ON m.mot_codigo = v.mot_codigo
            LEFT JOIN avaliacoes a ON v.via_codigo = a.via_codigo
            WHERE m.emp_codigo = ?
            GROUP BY m.mot_codigo
            ORDER BY media_avaliacao DESC, total_viagens DESC
            LIMIT 5
        `, [emp_codigo]);

        return rows;
    },

    async getRatingsReport(emp_codigo) {
        const [rows] = await db.query(`
            SELECT 
                ava_nota,
                COUNT(*) as total
            FROM avaliacoes a
            JOIN viagens v ON a.via_codigo = v.via_codigo
            WHERE v.emp_codigo = ?
            GROUP BY ava_nota
            ORDER BY ava_nota DESC
        `, [emp_codigo]);

        return rows;
    }
};
export const getReports = async () => {
    const [
        [cards],
        [faturamentoMensal],
        [viagensPorStatus],
        [viagensUltimos30Dias],
        [topEmpresas],
        [topMototaxistas],
    ] = await Promise.all([
        db.query(`
            SELECT
                COUNT(*) AS total_viagens,

                COALESCE(
                    SUM(
                        CASE
                            WHEN via_status = 'FINALIZADA'
                            THEN via_valor_final
                        END
                    ),
                    0
                ) AS faturamento_total,

                COUNT(
                    CASE
                        WHEN via_status = 'FINALIZADA'
                        THEN 1
                    END
                ) AS viagens_finalizadas,

                COUNT(
                    CASE
                        WHEN via_status = 'EM_ANDAMENTO'
                        THEN 1
                    END
                ) AS viagens_em_andamento,

                COUNT(
                    CASE
                        WHEN via_status = 'CANCELADA'
                        THEN 1
                    END
                ) AS viagens_canceladas,

                ROUND(
                    AVG(
                        CASE
                            WHEN via_status = 'FINALIZADA'
                            THEN via_valor_final
                        END
                    ),
                    2
                ) AS ticket_medio,

                MAX(via_valor_final) AS maior_corrida,

                MIN(via_valor_final) AS menor_corrida
            FROM viagens
        `),

        db.query(`
            SELECT
                DATE_FORMAT(
                    via_data_inicio,
                    '%Y-%m'
                ) AS mes,

                ROUND(
                    SUM(via_valor_final),
                    2
                ) AS faturamento

            FROM viagens

            WHERE via_status = 'FINALIZADA'

            GROUP BY mes

            ORDER BY mes
        `),

        db.query(`
            SELECT
                via_status,
                COUNT(*) AS quantidade

            FROM viagens

            GROUP BY via_status
        `),

        db.query(`
            SELECT
                DATE(via_data_inicio) AS dia,

                COUNT(*) AS viagens,

                ROUND(
                    SUM(via_valor_final),
                    2
                ) AS faturamento

            FROM viagens

            WHERE via_data_inicio >=
                NOW() - INTERVAL 30 DAY

            GROUP BY dia

            ORDER BY dia
        `),

        db.query(`
            SELECT
                e.emp_codigo,
                e.emp_nome,

                COUNT(*) AS viagens,

                ROUND(
                    SUM(v.via_valor_final),
                    2
                ) AS faturamento

            FROM viagens v

            INNER JOIN empresas e
                ON e.emp_codigo = v.emp_codigo

            WHERE v.via_status = 'FINALIZADA'

            GROUP BY
                e.emp_codigo,
                e.emp_nome

            ORDER BY faturamento DESC

            LIMIT 10
        `),

        db.query(`
            SELECT
                m.mot_codigo,
                m.mot_nome,
                e.emp_nome,
                COUNT(*) AS viagens,
                ROUND(SUM(v.via_valor_final), 2) AS faturamento
            FROM viagens v

            INNER JOIN mototaxistas m
                ON m.mot_codigo = v.mot_codigo

            INNER JOIN empresas e
                ON e.emp_codigo = v.emp_codigo

            WHERE v.via_status = 'FINALIZADA'

            GROUP BY
                m.mot_codigo,
                m.mot_nome,
                e.emp_nome

            ORDER BY faturamento DESC
            LIMIT 10;
        `),
    ]);

    return {
        cards: cards[0],

        faturamentoMensal,

        viagensPorStatus,

        viagensUltimos30Dias,

        topEmpresas,

        topMototaxistas,
    };
};