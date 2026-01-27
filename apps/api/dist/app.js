"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const routes_1 = require("./routes");
exports.app = (0, fastify_1.default)({
    logger: false,
});
exports.app.register(cors_1.default);
exports.app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || "test-secret",
});
exports.app.register(routes_1.routes);
