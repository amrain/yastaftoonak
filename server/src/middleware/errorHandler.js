function notFound(req, res) {
  res.status(404).json({ message: `المسار غير موجود: ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: error.message || 'حدث خطأ غير متوقع في الخادم.',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
}

module.exports = { notFound, errorHandler };
