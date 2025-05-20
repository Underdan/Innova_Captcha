"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateCaptcha_1 = require("../utils/validateCaptcha");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, lastname, password, email, credential } = req.body;
        const userUnique = yield user_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: { email, credential }
            }
        });
        if (userUnique) {
            return res.status(400).json({
                msg: `El usuario ya existe con el email ${email} o credencial => ${credential}`
            });
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        yield user_1.User.create({
            name,
            lastname,
            password: passwordHash,
            email,
            credential,
            status: 1
        });
        return res.json({
            msg: `Usuario ${name} ${lastname} se creó con éxito`
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Existe un error al crear el usuario.`,
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, captchaToken } = req.body;
    const isCaptchaValid = yield (0, validateCaptcha_1.validateCaptcha)(captchaToken);
    if (!isCaptchaValid) {
        return res.status(403).json({ msg: 'Captcha inválido' });
    }
    const userOne = yield user_1.User.findOne({ where: { email } });
    if (!userOne) {
        return res.status(400).json({
            msg: `Usuario no existe con el email => ${email}`
        });
    }
    const passwordValid = yield bcrypt_1.default.compare(password, userOne.password);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password incorrecto => ${password}`
        });
    }
    const token = jsonwebtoken_1.default.sign({ email }, process.env.SECRET_KEY || 'clave-secreta', {});
    return res.json({
        token,
        user: {
            id: userOne.id,
            email: userOne.email,
            name: userOne.name
        }
    });
});
exports.login = login;
