"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./utils/swagger");
const error_middleware_1 = require("./middleware/error.middleware");
const health_route_1 = __importDefault(require("./routes/health.route"));
const passenger_route_1 = __importDefault(require("./routes/passenger.route"));
const rideRequest_route_1 = __importDefault(require("./routes/rideRequest.route"));
const cab_route_1 = __importDefault(require("./routes/cab.route"));
const logger_1 = __importDefault(require("./config/logger"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging Middleware
app.use((req, res, next) => {
    logger_1.default.http(`${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/health', health_route_1.default);
app.use('/passengers', passenger_route_1.default);
app.use('/ride-requests', rideRequest_route_1.default);
app.use('/cabs', cab_route_1.default);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Not Found - ${req.originalUrl}`,
    });
});
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
