const Product = require('../models/product');
const { validationResult } = require('express-validator');
const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const { post } = require('../routes/product');
const path = require('path');
const fs = require('fs');

exports.fetchProducts = (req, res, next) => {
  Product.fetchAll()
    .then((fetchedOrder) => {
      res.status(200).json({
        fetchedOrder,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(401).json({
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const fileName = req.body.fileName;
  const price = req.body.price;
  const description = req.body.description;
  const adminId = new mongodb.ObjectId(req.userId);

  const product = new Product(title, imageUrl, fileName, price, description, adminId);

  product.save();

  return res.status(201).json({
    message: 'Product created successfully!',
    post: {
      id: new Date().toISOString(),
      title: title,
      price: price,
      description: description,
    },
  });
};

exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId;
  console.log("checking......."+req.body.price)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const fileName = req.body.fileName;
  const price = req.body.price;
  const description = req.body.description;
  const adminId = new mongodb.ObjectId(req.body.adminId);



  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error('Could not find Product.');
        error.statusCode = 404;
        throw error;
      }


      const updatedProduct = new Product(title, imageUrl, fileName, price, description, adminId, productId);

      return updatedProduct.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Product updated!', Product: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
      .then(Product => {
        if(Product.imageUrl) {
          clearImage(Product.imageUrl);
        } 
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });

  Product.deleteById(productId)
    .then((result) => {
      res.status(201).json({
        message: 'Product deleted successfully!',
        post: {
          id: productId,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
