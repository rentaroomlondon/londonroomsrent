import express from "express";
import { submitContact } from "../Controllers/contactController.js";

const router = express.Router();

router.post("/", submitContact);

export default router;