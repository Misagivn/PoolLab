import axios from "axios";

class ApiManagerWithToken {
    constructor() {
        this.instance = axios.create({
            baseURL: "https://poollabwebapi20241008201316.azurewebsites.net/api",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            },
            responseType: "json",
            withCredentials: true
        });

        // Add request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                // Get token from localStorage or your preferred storage method
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor (optional)
        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle 401 Unauthorized errors
                if (error.response && error.response.status === 401) {
                    // Handle token expiration - e.g., redirect to login
                    localStorage.removeItem('token');
                    // You might want to redirect to login page here
                    // window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Helper methods for common operations
    setToken(token) {
        localStorage.setItem('token', token);
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    // GET request
    get(url, config = {}) {
        return this.instance.get(url, config);
    }

    // POST request
    post(url, data, config = {}) {
        return this.instance.post(url, data, config);
    }

    // PUT request
    put(url, data, config = {}) {
        return this.instance.put(url, data, config);
    }

    // DELETE request
    delete(url, config = {}) {
        return this.instance.delete(url, config);
    }

    // PATCH request
    patch(url, data, config = {}) {
        return this.instance.patch(url, data, config);
    }
}

const apiManagerWithToken = new apiManagerWithToken();
export default apiManagerWithToken;