import api from "./api"
//user login -> to get tokens pair for the user 
export const loginUser = (data)=>{
    return api.post('token/',data);
}
//get refreshtoken from acceess token 
export const refreshToken = (data) =>{
    return api.post('token/refresh/',data)
}

//get Register data 
export const registerUser = (data) => {
    return api.post('register/',data)
}


