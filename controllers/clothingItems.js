const ClothingItem = require("../models/clothingItem");
// const {
//   BAD_REQUEST_STATUS_CODE,
//   NOT_FOUND_STATUS_CODE,
//   SERVER_ERROR_STATUS_CODE,
//   FORBIDDEN,
// } = require("../utils/errors");
const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ForbiddenError } = require("../errors/ForbiddenError");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const createItem = (req, res) => {
  console.log(req);
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("You can't delete this item"));
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .orFail()
        .then(() => res.send({ message: "Item deleted" }))
        .catch((err) => {
          console.error(err);
          if (err.name === "ValidationError" || err.name === "CastError") {
            next(new BadRequestError("Invalid data"));
          }
          if (err.name === "DocumentNotFoundError") {
            next(new NotFoundError("Requested resource not found"));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else {
        next(err);
      }
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, {
//     $set: { imageUrl }
//       .orFail()
//       .then((item) => res.send({ data: item }))
//       .catch((err) => {
//         console.error(err);
//         if (err.name === "ValidationError") {
//           next(new BadRequestError("Invalid data"));
//         }
//         if (err.name === "DocumentNotFoundError") {
//           next(new NotFoundError("Requested resource not found"));
//         }
//         else {
//        next(err);
//      }
//       }),
//   });
// };

module.exports = {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
