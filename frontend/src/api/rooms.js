import api from './api'
 

// we use api. post and api.get to send and achive sensitive data 
export const getRooms = () =>{
    return api.get('rooms/')
}
export const createRoom = (data) =>{
    return api.post('rooms/create/',data)
}

export const getRoomDetails = (room_id) =>{
    return api.get(`rooms/${room_id}/`)
}

export const verifyRoomPassword = (room_id ,passwordData)=>{
    return api.post(`rooms/${room_id}/verify/`,passwordData)
}
