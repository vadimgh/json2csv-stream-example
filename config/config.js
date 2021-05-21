/**
 * configuration file
 *
 */

'use strict';

module.exports = {
  development: {
    userId: 'fdkkkipis',
    externalApiUrl: 'https://6u3td6zfza.execute-api.us-east-2.amazonaws.com',
    externalApiLoginUserPath: '/prod/user/login',
    externalApiUserTransaction: '/prod/user/transactions',
    username: 'test1',
    password: 'test1pass',
    allowedOrigins: ['http://localhost:4200']
  },
  test: {},
  production: {
    userId: 'fdkkkipis',
    externalApiUrl: 'https://6u3td6zfza.execute-api.us-east-2.amazonaws.com',
    externalApiLoginUserPath: '/prod/user/login',
    externalApiUserTransaction: '/prod/user/transactions',
    username: 'test1',
    password: 'test1pass',
    allowedOrigins: ['http://localhost:4200']
  },
};
