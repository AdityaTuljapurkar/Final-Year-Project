import api from './api'
 
// we use api.post and api.get to send and achive sensitive data 
export const getRooms = () =>{
    return api.get('rooms/')
}

export const createRoom = (data) =>{
    return api.post('rooms/create/', data)
}

export const getRoomDetails = (room_id) =>{
    return api.get(`rooms/${room_id}/`)
}

// THE FIX: We explicitly wrap the string into a { password: ... } object here
export const verifyRoomPassword = (room_id, passwordString) => {
    return api.post(`rooms/${room_id}/verify/`, { password: passwordString })
}