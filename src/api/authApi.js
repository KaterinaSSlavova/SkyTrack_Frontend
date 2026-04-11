import axios from "axios";

const url = "http://localhost:8080/auth";

export async function login(data){
   const response = await axios.post(`${url}/login`, data);
   return response.data;
}

export async function register(data){
    const response = await axios.post(`${url}/register`, data);
    return response.data;
}