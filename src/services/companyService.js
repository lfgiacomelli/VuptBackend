import { getAvailableCompanies, getCompanyById, getPopularCompanies, addFirstAttendantToCompany, createCompany, deleteCompany, getCompanies, updateCompany } from "../repositories/companyRepository.js";


export const createCompanyService = async (company) => {
    return await createCompany(company);
}

export const updateCompanyService = async (emp_codigo, updateData) => {
    return await updateCompany(emp_codigo, updateData);
}

export const deleteCompanyService = async (emp_codigo) => {
    return await deleteCompany(emp_codigo);
}

export const getCompaniesService = async () => {
    return await getCompanies();
}

export const addFirstAttendantToCompanyService = async (emp_codigo) => {
    return await addFirstAttendantToCompany(emp_codigo);
}

export const getAvailableCompaniesService = async (city) => {
    return await getAvailableCompanies(city);
}

export const getCompanyByIdService = async (emp_codigo) => {
    return await getCompanyById(emp_codigo);
}



export const getPopularCompaniesService = async (city) => {
    return await getPopularCompanies(city);
}