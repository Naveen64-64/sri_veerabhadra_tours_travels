import api from './api'

export const getTours = () => api.get('/tours')
export const getAllTours = () => api.get('/tours/all')
export const getTour = (id) => api.get(`/tours/${id}`)
export const createTour = (data) => api.post('/tours', data)
export const updateTour = (id, data) => api.put(`/tours/${id}`, data)
export const deleteTour = (id) => api.delete(`/tours/${id}`)
