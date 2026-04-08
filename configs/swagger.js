const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const serverConfig = require('./server.config');
const schemasConfig = require('../docs/schemas');

const isDevelopment = process.env.NODE_ENV === 'development';
const swaggerEnabled = process.env.SWAGGER_ENABLED === 'true' || isDevelopment;

function getServerUrl() {
  if (process.env.SWAGGER_SERVER_URL) return process.env.SWAGGER_SERVER_URL;

  if (!isDevelopment) {
    return process.env.PRODUCTION_SERVER_URL || 'https://api.example.com';
  }

  const port = process.env.PORT || serverConfig.PORT;
  return `http://localhost:${port}`;
}

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Shopolio API',
    version: '1.0.0',
    description: 'REST API documentation for Shopolio',
  },
  servers: [{ url: getServerUrl() }],
  tags: [
    { name: 'Auth', description: 'Authentication & authorization' },
    { name: 'Products', description: 'Product catalog endpoints' },
    { name: 'Orders', description: 'Order processing endpoints' },
  ],
  components: {
    ...schemasConfig.components,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

function buildSwaggerSpec() {
  return swaggerJSDoc({
    definition: swaggerDefinition,
    apis: [path.resolve(process.cwd(), 'routes/**/*.js')],
  });
}
module.exports = {
  swaggerEnabled,
  swaggerSpec: swaggerEnabled ? buildSwaggerSpec() : null,
};

