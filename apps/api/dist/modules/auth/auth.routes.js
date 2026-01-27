"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const register_controller_1 = require("./register.controller");
const login_controller_1 = require("./login.controller");
async function authRoutes(app) {
    app.post("/register", register_controller_1.register);
    app.post("/login", login_controller_1.login);
}
