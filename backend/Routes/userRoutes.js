import express from "express";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  uploadUserDocument,
  updateDocumentStatus
} from "../Controllers/userController.js";

const router = express.Router();


// GET all users
router.get("/", getAllUsers);

router.post("/upload-document", uploadUserDocument);
router.put("/document/status", updateDocumentStatus);
// GET user by ID
router.get("/:id", getUserById);


// UPDATE user
router.put("/:id", updateUser);


// DELETE user
router.delete("/:id", deleteUser);


// UPDATE logged in profile
router.patch("/profile/update", updateProfile);


export default router;