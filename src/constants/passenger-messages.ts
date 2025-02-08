export enum PassengerControllerMessages {
    CREATE_PASSENGER_SUCCESS = "Pasajero registrado con éxito",
    CREATE_PASSENGER_ERROR = "No se pudo registrar el pasajero",
    UPDATE_PASSENGER_SUCCESS = "Pasajero actualizado con éxito",
    UPDATE_PASSENGER_ERROR = "No se pudo actualizar el pasajero",
    GET_PASSENGER_SUCCESS = "Pasajero encontrado con éxito",
    GET_PASSENGER_ERROR = "No se pudo encontrar el pasajero",
    DELETE_PASSENGER_SUCCESS = "Pasajero eliminado con éxito",
    DELETE_PASSENGER_ERROR = "No se pudo eliminar el pasajero"
}

export enum PassengerRepositoryMessages {
    GET_PASSENGER_ERROR = "No se pudo encontrar el pasajero",
    CREATE_PASSENGER_ERORR = "No se pudo crear el pasajero",
    DELETE_PASSENGER_ERROR = "No se pudo eliminar el pasajero",
    UPDATE_PASSENGER_ERROR = "No se pudo actualizar el pasajero",
}