import express from "express";
import { signup, login } from "../controllers/authController.js";
import { signupValidation } from "../validators/authValidator.js";
import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const router = express.Router();

router.post("/signup", signupValidation, validate, signup);
router.post("/login", login);

export default router;