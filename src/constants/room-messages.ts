export enum RoomControllerMessages {
    CREATE_ROOM_SUCCESS = 'Habitación registrada con éxito',
    CREATE_ROOM_ERROR = 'No se pudo registrar la habitación',
    UPDATE_ROOM_SUCCESS = 'Habitación actualizada con éxito',
    UPDATE_ROOM_ERROR = 'No se pudo actualizar la habitación',
    GET_ROOM_SUCCESS = 'Habitación encontrada con éxito',
    GET_ROOM_ERROR = 'No se pudo encontrar la habitación',
    DELETE_ROOM_SUCCESS = 'Habitación eliminada con éxito',
    DELETE_ROOM_ERROR = 'No se pudo eliminar la habitación',
}

export enum RoomRepositoryMessages {
    GET_ROOM_ERROR = 'No se pudo encontrar la habitación',
    CREATE_ROOM_ERORR = 'No se pudo crear la habitación',
    DELETE_ROOM_ERROR = 'No se pudo eliminar la habitación',
    UPDATE_ROOM_ERROR = 'No se pudo actualizar la habitación',
}
