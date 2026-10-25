import { createEmployee, updateEmployee, deleteEmployee, getEmployeeById, getAllEmployees, getAvailableEmployees, getEmployeeWithoutMotorcycle  } from "../repositories/employeeRepository.js";

export const getAllEmployeesService = async (ate_codigo) => {
    return await getAllEmployees(ate_codigo);
}

export const createEmployeeService = async (employee) => {
    const hashedPassword = await bcrypt.hash(employee.mot_senha, 10);

    const employeeData = {
        ...employee,
        mot_senha: hashedPassword,
        mot_created_at: new Date(),
        mot_updated_at: new Date()
    }
    return await createEmployee(employeeData);
};

export const updateEmployeeService = async (mot_codigo, updateData) => {
    if (updateData.mot_senha) {
        const hashedPassword = await bcrypt.hash(updateData.mot_senha, 10);
        updateData.mot_senha = hashedPassword;
    }
    return await updateEmployee(mot_codigo, updateData);
};

export const deleteEmployeeService = async (mot_codigo) => {
    return await deleteEmployee(mot_codigo);
};

export const getEmployeeByIdService = async (mot_codigo) => {
    return await getEmployeeById(mot_codigo);
};

export const getAvailableEmployeesService = async (ate_codigo) => {
    return await getAvailableEmployees(ate_codigo);
}

export const getEmployeesWithoutMotorcycleService = async (emp_codigo) => {
    return await getEmployeeWithoutMotorcycle(emp_codigo);
}