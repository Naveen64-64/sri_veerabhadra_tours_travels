"""
RAG Document model — for vector search knowledge base.
"""

# MongoDB document structure for the 'rag_documents' collection:
#
# {
#     "_id": ObjectId,
#     "title": str,
#     "content": str,          # The text content used for RAG
#     "category": str,         # "company", "vehicle", "bus", "car", "route",
#                              # "destination", "package", "faq", "policy", "service"
#     "source": str,           # Where this data came from
#     "metadata": dict,        # Extra structured info
#     "embedding": [float],    # Vector embedding (384 dimensions for MiniLM)
#     "createdAt": datetime,
#     "updatedAt": datetime,
# }
#
# MongoDB Atlas Vector Search Index Configuration:
# Index Name: "vector_index"
# Collection: "rag_documents"
# Definition:
# {
#   "fields": [
#     {
#       "type": "vector",
#       "path": "embedding",
#       "numDimensions": 384,
#       "similarity": "cosine"
#     }
#   ]
# }
