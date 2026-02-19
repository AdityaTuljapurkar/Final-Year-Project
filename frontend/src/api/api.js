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

export default api;
