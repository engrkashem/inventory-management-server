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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const DB_1 = __importDefault(require("./app/DB"));
const config_1 = __importDefault(require("./app/config"));
let server;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.DB_URL);
        // seed super admin
        (0, DB_1.default)();
        server = app_1.default.listen(config_1.default.PORT, () => {
            console.log('Inventory Management Server is Listening on port:', config_1.default.PORT);
        });
    }
    catch (err) {
        console.log(err);
    }
});
main();
process.on('unhandledRejection', () => {
    console.log('unhandledRejection is detected. Server is being shutting down..');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('uncaughtException', () => {
    console.log('uncaughtException occurred. Server is being shutting down..');
    process.exit(1);
});
