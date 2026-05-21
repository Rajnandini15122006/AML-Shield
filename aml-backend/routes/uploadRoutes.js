const express =
  require("express");

const multer =
  require("multer");

const {
  uploadFile
} = require(
  "../controllers/uploadController"
);
const protect = require("../middleware/auth");

const router =
  express.Router();

const upload =
  multer({
    dest: "uploads/"
  });

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadFile
);

module.exports =
  router;