import { getTravelById, getTravelsByUser, getMotorcycle, getActiveTravel, getOriginAndDestination, finishTravel, getTravels } from "../repositories/travelRepository.js";

export const getTravelsByUserService = async (usu_codigo) => {
    return await getTravelsByUser(usu_codigo);
}

export const getTravelByIdService = async (via_codigo) => {
    return await getTravelById(via_codigo);
}

export const getMotorcycleService = async (mot_codigo) => {
    return await getMotorcycle(mot_codigo);
}

export const getActiveTravelService = async (usu_codigo) => {
    return await getActiveTravel(usu_codigo);
}

export const getOriginAndDestinationService = async (via_codigo) => {
    return await getOriginAndDestination(via_codigo);
}

export const finishTravelService = async (via_codigo) => {
    return await finishTravel(via_codigo);
};

export const getTravelsService = async (emp_codigo) => {
    return await getTravels(emp_codigo);
};

