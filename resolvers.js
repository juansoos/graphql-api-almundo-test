import Db from '../database';
import { db } from './config';

const database = new Db(db);

const resolvers = {
  Query: {
    hotels: async () => {
      await database.connect();
      const hotels = await database.getHotels();
      await database.disconnect();
      return hotels;
    },
    hotelsByName: async (_, args) => {
      await database.connect();
      const hotels = await database.getHotelsByName(args.name);
      await database.disconnect();
      return hotels;
    },
    hotelsByStars: async (_, args) => {
      await database.connect();
      const hotels = await database.getHotelsByStars(args.stars);
      await database.disconnect();
      return hotels;
    },
    hotel: async (_, args) => {
      await database.connect();
      const hotel = await database.getHotel(args.id);
      await database.disconnect();
      return hotel;
    },
  },
  Mutation: {
    createHotel: async (_, args) => {
      await database.connect();
      const hotel = await database.createHotel(args.hotel);
      await database.disconnect();
      return hotel;
    },
    updateHotel: async (_, args) => {
      await database.connect();
      const hotel = await database.updateHotel(args.id, args.hotel);
      await database.disconnect();
      return hotel;
    },
    deleteHotel: async (_, args) => {
      await database.connect();
      const hotel = await database.deleteHotel(args.id);
      await database.disconnect();
      if (hotel) {
        return { message: 'valid deleting' };
      }
    },
  },
};

module.exports = resolvers;
