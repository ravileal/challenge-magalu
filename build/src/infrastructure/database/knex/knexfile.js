"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = {
    development: {
        client: process.env.DATABASE_CLIENT || 'pg',
        connection: {
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        },
        migrations: {
            extension: 'ts',
            directory: './migrations',
        },
    },
};
exports.default = config;
