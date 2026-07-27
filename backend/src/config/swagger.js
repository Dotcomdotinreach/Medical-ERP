import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meridian Hospital Management System API",
      version: "1.0.0",
      description: "Complete API for Meridian Hospital Management System"
    },
    servers: [{ url: "http://localhost:5000/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
