import { ReportsService, getReportsService } from "../services/reportsService.js";

export const ReportsController = {

    async dashboard(req, res) {
        try {
            const { emp_codigo } = req.params;

            const data = await ReportsService.getDashboard(emp_codigo);

            return res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Erro ao gerar dashboard"
            });
        }
    },

    async trips(req, res) {
        try {
            const { emp_codigo } = req.params;

            const data = await ReportsService.getTrips(emp_codigo);

            return res.json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erro ao buscar viagens"
            });
        }
    }

};
export const getReportsController = async (req, res) => {
    try {
        const reports = await getReportsService();

        return res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Erro ao buscar relatórios."
        });
    }
};