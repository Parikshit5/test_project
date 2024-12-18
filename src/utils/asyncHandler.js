export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (error) {
    console.error('Error:', error.message || error);

    // Ensure error.code is numeric and valid; fallback to 500 if not
    const statusCode =
      typeof error.code === 'number' && error.code >= 100 && error.code < 600
        ? error.code
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
