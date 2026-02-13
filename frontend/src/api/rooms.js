import api from './api'
 
export const getRooms = () =>{
    return api.get('rooms/')
}
export const createRoom = (data) =>{
    return api.post('rooms/create/',data)
}

export const getRoomDetails = (room_id) =>{
    return api.get(`rooms/${room_id}/`)
}
