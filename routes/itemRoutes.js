const express = require('express');
const router = express.Router();
const itemController = require('./../controllers/itemController');

router.route('/').get(itemController.getItemsAWSDB);

// These routes are from when the items were handled by MongoDB
// router
//   .route('/')
//   .get(itemController.getAllItems)
//   .post(itemController.createItem);

// router
//   .route('/:id')
//   .get(itemController.getItem)
//   .patch(itemController.updateItem)
//   .delete(itemController.deleteItem);

module.exports = router;
