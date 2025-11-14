import axios from 'axios';

const API_BASE_UPL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_UPL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const radioAPI = {
    getStations: () => api.get('/radiodata'),
    
    // Получить станцию по ID
    getStation: (id) => api.get(`/radiodata/${id}/`),
  
    // Создать станцию
    createStation: (data) => api.post('/radiodata/', data),
  
    // Обновить станцию
    updateStation: (id, data) => api.put(`/radiodata/${id}/`, data),
  
    // Удалить станцию
    deleteStation: (id) => api.delete(`/radiodata/${id}/`),
};

export default api;