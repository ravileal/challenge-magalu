"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFavoriteSchema = exports.loginSchema = exports.updateClientSchema = exports.clientParamsSchema = exports.createClientSchema = void 0;
const zod_1 = require("zod");
exports.createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
});
exports.clientParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.updateClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email format.' }),
});
exports.addFavoriteSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, { message: 'productId cannot be empty.' }),
});
