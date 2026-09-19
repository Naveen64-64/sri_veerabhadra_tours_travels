import api from './api'

export const createBooking = (data) => api.post('/bookings', data)
export const getBookings = (params) => api.get('/bookings', { params })
export const getBooking = (id) => api.get(`/bookings/${id}`)
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status })
