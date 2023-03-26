const Item = require('./../models/itemModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const { createItem, getItems } = require('../dynamo');

exports.getItemsAWSDB = catchAsync(async (req, res, next) => {
  const items = await getItems();

  res.status(200).json(items);
});


// These are methods from when the store items were being stored in the Mongo DB

// exports.getAllItems = catchAsync(async (req, res) => {
//   const features = new APIFeatures(Item.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields();
//   const items = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: items.length,
//     data: items,
//   });
// });

// exports.getItem = catchAsync(async (req, res) => {
//   const item = await Item.findById(req.params.id);
//   res.status(200).json({
//     status: 'success',
//     data: item,
//   });
// });

// exports.createItem = catchAsync(async (req, res) => {
//   const item = await Item.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: item,
//   });
// });

// exports.updateItem = catchAsync(async (req, res) => {
//   const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: item,
//   });
// });

// exports.deleteItem = catchAsync(async (req, res) => {
//   await Item.findByIdAndDelete(req.params.id);
//   res.status(200).json({
//     status: 'success',
//     message: 'Item deleted successfully.',
//   });
// });
