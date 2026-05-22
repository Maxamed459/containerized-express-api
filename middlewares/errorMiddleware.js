import { errorResponse } from "../utils/apiResponse.js";

const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue || {})[0] || "field";
  return {
    statusCode: 409,
    message: `${field} already exists`,
  };
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((item) => ({
    field: item.path,
    message: item.message,
  }));

  return {
    statusCode: 400,
    message: "Validation failed",
    errors,
  };
};

const errorMiddleware = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let errors = error.errors || null;

  if (error.code === 11000) {
    const duplicateError = handleDuplicateKeyError(error);
    statusCode = duplicateError.statusCode;
    message = duplicateError.message;
  }

  if (error.name === "ValidationError") {
    const validationError = handleValidationError(error);
    statusCode = validationError.statusCode;
    message = validationError.message;
    errors = validationError.errors;
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  return errorResponse(res, statusCode, message, errors);
};

export default errorMiddleware;
