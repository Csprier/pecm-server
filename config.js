'use strict';

exports.PORT = 8080;

exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/pecm';

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';