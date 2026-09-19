import api from './api'

export const getDestinations = () => api.get('/destinations')
export const getAllDestinations = () => api.get('/destinations/all')
export const getDestination = (id) => api.get(`/destinations/${id}`)
export const createDestination = (data) => api.post('/destinations', data)
export const updateDestination = (id, data) => api.put(`/destinations/${id}`, data)
export const deleteDestination = (id) => api.delete(`/destinations/${id}`)
