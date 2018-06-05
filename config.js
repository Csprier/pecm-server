'use strict';

exports.PORT = process.env.PORT || 8080;

exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/pecm';

exports.JWT_SECRET = process.env.JWT_SECRET || 'testing-secret';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';