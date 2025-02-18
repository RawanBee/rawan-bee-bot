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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageManager = void 0;
exports.StorageManager = {
    save: (message) => {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatHistory.push(message);
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    },
    load: () => JSON.parse(localStorage.getItem("chatHistory")) || [],
    saveToDatabase: (endpoint, message) => __awaiter(void 0, void 0, void 0, function* () {
        yield fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        });
    }),
};
