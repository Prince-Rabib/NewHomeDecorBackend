const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const isUser = require('../middleware/is-user');
const ordersController = require('../controllers/orders');
const isAdmin = require('../middleware/is-admin');

router.post('/create-order', isUser, ordersController.postCreateOrder);

router.get('/fetch-orders', isUser, ordersController.fetchOrders);

router.put('/update-order/:orderId', ordersController.updateOrder);


module.exports = router;