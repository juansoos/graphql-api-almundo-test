module.exports = `
  # Entidad hotel
  type Hotel {
    _id: ID!
    name: String!
    price: Float!
    stars: Int!
    comments: [Comment]
  }
  # Entidad comentario
  type Comment {
    author: String!
    content: String!
  }
  # Input crear hotel
  input addHotel {
    name: String!
    price: Float!
    stars: Int!
  }
  # Input editar curso
  input editHotel {
    name: String!
    price: Float!
    stars: Int!
  }

`;
