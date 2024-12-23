const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingBody,
  validateId,
} = require("../middlewares/validation");
const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, validateClothingBody, createItem);
router.get("/", getItems);
// router.put("/:itemId", updateItem);
router.delete("/:itemId", auth, validateId, deleteItem);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
