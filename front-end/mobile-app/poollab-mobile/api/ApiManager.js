import axios from "axios"

const ApiManager = axios.create({
    baseURL: "https://poollabwebapi20241008201316.azurewebsites.net/api",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    responseType: "json",
    withCredentials: true
})

export default ApiManager