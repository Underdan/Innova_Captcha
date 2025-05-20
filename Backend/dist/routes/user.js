"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
router.post("/api/user/register", (req, res) => {
    (0, user_1.register)(req, res);
});
router.post("/api/user/login", (req, res) => {
    (0, user_1.login)(req, res);
});
exports.default = router;
