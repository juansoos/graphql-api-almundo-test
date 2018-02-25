import { makeExecutableSchema } from 'graphql-tools';
import Hotel from './Hotel';
import resolvers from '../resolvers';

const rootQuery = `
  type Query {
    # Query para obtener todos los hoteles de la base de datos
    hotels: [Hotel]
    # Query para obtener todos los hoteles que coincidan con un nombre
    hotelsByName(name: String): [Hotel]
    # Query para obtener todos los hoteles que coincidan con un tipo de estrellas
    hotelsByStars(stars: Int): [Hotel]
    # Query para obtener un hotel
    hotel(id: String): Hotel
  }

  type Mutation {
    # Mutation para crear un hotel
    createHotel(hotel: addHotel): Hotel
    # Mutation para modificar un hotel
    updateHotel(id: String!, hotel: editHotel): Hotel
    # Mutation para eliminar un hotel
    deleteHotel(id: String!): String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [rootQuery, Hotel],
  resolvers,
});

module.exports = schema;
