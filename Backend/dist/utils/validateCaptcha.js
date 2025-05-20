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
exports.validateCaptcha = void 0;
const axios_1 = __importDefault(require("axios"));
const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeG0nAPAAAAADsxxxaW9dkfNw2p3xk82q8d_C2Nes9M4w';
const validateCaptcha = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);
        return response.data.success;
    }
    catch (error) {
        console.error('Error validando reCAPTCHA:', error);
        return false;
    }
});
exports.validateCaptcha = validateCaptcha;
