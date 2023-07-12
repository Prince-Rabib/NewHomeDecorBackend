const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
  constructor(title, imageUrl, fileName, price, description, adminId, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.fileName = fileName;
    this.price = price;
    this.description = description;
    this.adminId = adminId;
    // don't need to convert the id in controller. And if we're adding /product the id field should be null
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    let dbOp;
    const db = getDb();
    if (this._id) {
      // update the Product
      // $set is for update selected Product
      dbOp = db
      .collection('products')
      .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then((Product) => {
        return Product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
