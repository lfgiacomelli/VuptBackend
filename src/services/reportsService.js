import { ReportsRepository, getReports } from "../repositories/reportsRepository.js";

export const ReportsService = {

    async getDashboard(emp_codigo) {
        const [
            metrics,
            revenue,
            requests,
            topDrivers,
            ratings
        ] = await Promise.all([
            ReportsRepository.getGeneralMetrics(emp_codigo),
            ReportsRepository.getRevenueByDay(emp_codigo),
            ReportsRepository.getRequestsReport(emp_codigo),
            ReportsRepository.getTopDrivers(emp_codigo),
            ReportsRepository.getRatingsReport(emp_codigo)
        ]);

        return {
            metrics,
            revenue,
            requests,
            topDrivers,
            ratings
        };
    },

    async getTrips(emp_codigo) {
        return ReportsRepository.getTripsReport(emp_codigo);
    }

};
export const getReportsService = async () => {
    return await getReports();
}