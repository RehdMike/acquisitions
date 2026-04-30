import logger from "#config/logger.js";
import { createUser, signInUser } from "#services/auth.service.js";
import { cookies } from "#utils/cookies.js";
import { formatValidationError } from "#utils/format.js";
import { jwttoken } from "#utils/jwt.js";
import { signInSchema, signupSchema } from "#validations/auth.validation.js";

const createAuthToken = (user) => {
  return jwttoken.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const user = await createUser({ name, email, password, role });
    const token = createAuthToken(user);

    cookies.set(res, "token", token);

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      message: "User registered",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error("Signup error", e);

    if (e.message === "User already exists") {
      return res.status(409).json({ error: "Email already exists" });
    }

    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const user = await signInUser(validationResult.data);
    const token = createAuthToken(user);

    cookies.set(res, "token", token);

    logger.info(`User signed in successfully: ${user.email}`);

    res.status(200).json({
      message: "User signed in successfully",
      user,
    });
  } catch (e) {
    logger.error("Signin error", e);

    if (e.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    next(e);
  }
};
