import axios from "axios";


// The Axios Instance  
// https://axios-http.com/docs/instance

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
    // telling the Django that i am sending you the json file so dont get confused 
  },
});
//use for telling hey i let user enter 
api.interceptors.request.use(
(config)=>{
  // looking into browser for token
  const token = localStorage.getItem('access')
  // check if there is a token then attach it  
  if (token){
    config.headers.Authorization = `Bearer ${token}`

  }
  return config
},
(error)=>{ return Promise.reject(error)
// telling the user to that session is timed out 
});

api.interceptors.response.use(
  (response)=>{
    return response
  },
  (error)=>{
    if (error.response &&( error.response.status == 401 || error.response.status == 403 )){
      
     
     
      // Check if the error came specifically from the room verification endpoint.
      // If it did, return the error immediately so RoomLists.jsx can show the 
      // "Incorrect Password" message instead of logging the user out.
      if (error.config && error.config.url && error.config.url.includes('/verify/')) {
        return Promise.reject(error); 
      }
      

      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      window.location.href = '/login'
    }
    return Promise.reject(error);
  }
)

export default api;