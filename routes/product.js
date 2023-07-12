const express = require('express');
const productController = require('../controllers/product');
const { body } = require('express-validator');
const router = express.Router();
const isAdmin = require('../middleware/is-admin');

const addProductValidator = [
  body('title')
    .isString()
    .isLength({ min: 3, max: 150 })
    .withMessage('Please enter a valid title.')
    .trim(),

  body('price')
    .isNumeric()
    .withMessage('Please enter a valid price')
    .custom((value) => {
      if (value < 0) {
        return Promise.reject('price can not be less than 1');
      }
      return true;
    }),

  body('description')
    .isString()
    .withMessage('Please enter a valid price')
    .trim(),
];

// GET /feed/posts
router.get('/fetch-Products', productController.fetchProducts);


// POST /product/add-product
router.post(
  '/add-product',
  addProductValidator,
  isAdmin,
  productController.postAddProduct
);

// PUT /product/update-product/:productId

router.put('/update-product/:productId', isAdmin, productController.updateProduct);

router.put('/delete-product/:productId', productController.postDeleteProduct);

module.exports = router;
