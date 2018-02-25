const mongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
const co = require('co');
const Promise = require('bluebird');

class Db {
  constructor(options) {
    this.options = options;
    this.user = options.user;
    this.pwd = options.pwd;
    this.host = options.host;
    this.port = options.port;
    this.db = options.db;
    this.prod = options.prod || true;
  }
  connect(callback) {
    const self = this;
    const tasks = co.wrap(function* connect() {
      try {
        if (!self.prod) {
          self.connection = yield mongoClient.connect(`mongodb://${self.host}:${self.port}/${self.db}`);
        } else {
          self.connection = yield mongoClient.connect(`mongodb://${self.user}:${self.pwd}@${self.host}:${self.port}/${self.db}`);
        }
      } catch (error) {
        return Promise.reject(new Error(error)).asCallback(callback);
      }
      self.connected = true;
      return Promise.resolve(self);
    });
    return Promise.resolve(tasks()).asCallback(callback);
  }
  disconnect(callback) {
    const self = this;
    if (!self.connected) {
      return Promise.reject(new Error('Not connected')).asCallback(callback);
    }
    self.connection.close();
    self.connected = false;
    return Promise.resolve(self.connected).asCallback(callback);
  }
  getHotels(callback) {
    const { connected, connection } = this;
    if (!connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback);
    }
    const tasks = co.wrap(function* getHotels() {
      let result = null;
      try {
        result = yield connection.collection('hotels').find({}).toArray();
      } catch (error) {
        return Promise.reject(new Error(error)).asCallback(callback);
      }
      return Promise.resolve(result);
    });
    return Promise.resolve(tasks()).asCallback(callback);
  }
  getHotelsByName(name, callback) {
    const { connected, connection } = this;
    if (!connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback);
    }
    const tasks = co.wrap(function* getHotelsByName() {
      let result = null;
      try {
        result = yield connection.collection('hotels').find({ $text: { $search: name } }).toArray();
      } catch (error) {
        return Promise.reject(new Error(`hotels by name ${name} not found`));
      }
      return Promise.resolve(result);
    });
    return Promise.resolve(tasks()).asCallback(callback);
  }
  getHotelsByStars(stars, callback) {
    const { connected, connection } = this;
    if (!connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback);
    }
    const tasks = co.wrap(function* getHotelsByStars() {
      let result = null;
      try {
        result = yield connection.collection('hotels').find({ stars }).toArray();
      } catch (error) {
        return Promise.reject(new Error(`hotels by stars ${stars} not found`));
      }
      return Promise.resolve(result);
    });
    return Promise.resolve(tasks()).asCallback(callback);
  }
  getHotel(id, callback) {
    const { connected, connection } = this;
    if (!connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback);
    }
    const tasks = co.wrap(function* getHotel() {
      let result = null;
      try {
        result = yield connection.collection('hotels').findOne({ _id: objectID(id) });
      } catch (error) {
        return Promise.reject(new Error('hotel not found'));
      }
      if (result === null) {
        return Promise.reject(new Error('hotel not found'));
      }
      return Promise.resolve(JSON.parse(JSON.stringify(result))).asCallback(callback);
    });
    return Promise.resolve(tasks()).asCallback(callback);
  }
  createHotel(hotel, callback) {
    const { connected, connection } = this;
    if (!connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback);
    }
    const tasks = co.wrap(function* createHotel() {
      let result = null;
      try {
        result = yield connection.collection('hotels').insertOne(hotel);
      } catch (error) {
        return Promise.reject(new Error('error creating hotel'));
      }
      return Promise.resolve(JSON.parse(JSON.stringify(result.ops[0])));
    });
    return Promise.resolve(tasks()).asCallback(callback);
  }
  updateHotel(id, hotel, callback) {
    const { connected, connection } = this;
    if (!connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback);
    }
    const tasks = co.wrap(function* updateHotel() {
      let result = null;
      try {
        yield connection.collection('hotels').updateOne(
          { _id: objectID(id) },
          {
            $set: {
              name: hotel.name,
              price: hotel.price,
              stars: hotel.stars,
              updatedAt: new Date(),
            },
          },
        );
        result = yield connection.collection('hotels').findOne({ _id: objectID(id) });
      } catch (error) {
        return Promise.reject(new Error('error updating hotel'));
      }
      return Promise.resolve(JSON.parse(JSON.stringify(result)));
    });
    return Promise.resolve(tasks()).asCallback(callback);
  }
  deleteHotel(id, callback) {
    const { connected, connection } = this;
    if (!connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback);
    }
    const tasks = co.wrap(function* deleteHotel() {
      let result = null;
      try {
        result = yield connection.collection('hotels').deleteOne({ _id: objectID(id) });
      } catch (error) {
        return Promise.reject(new Error('error deleting hotel'));
      }
      if (result.result.n === 1) {
        return Promise.resolve(true);
      }
      return Promise.reject(new Error('error deleting hotel'));
    });
    return Promise.resolve(tasks()).asCallback(callback);
  }
}

module.exports = Db;
