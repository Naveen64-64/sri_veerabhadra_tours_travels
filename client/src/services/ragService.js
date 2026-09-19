import api from './api'

export const queryRAG = (query, top_k = 5) => api.post('/rag/query', { query, top_k })
export const getRAGStatus = () => api.get('/rag/status')
export const getRAGDocuments = () => api.get('/rag/documents')
export const ingestRAGDocument = (data) => api.post('/rag/ingest', data)
export const updateRAGDocument = (id, data) => api.put(`/rag/documents/${id}`, data)
export const deleteRAGDocument = (id) => api.delete(`/rag/documents/${id}`)
export const reindexRAGDocument = (id) => api.post(`/rag/reindex/${id}`)
export const ingestAllData = () => api.post('/rag/ingest-all')
