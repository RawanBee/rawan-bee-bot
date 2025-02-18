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
exports.AIProvider = void 0;
const AIProvider = (provider, apiKey, backendUrl, userMessage) => __awaiter(void 0, void 0, void 0, function* () {
    let url, headers, body;
    if (provider === "openai") {
        url = "https://api.openai.com/v1/chat/completions";
        headers = {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        };
        body = JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: userMessage }],
        });
    }
    else if (provider === "gemini") {
        url = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateText?key=${apiKey}`;
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({ prompt: userMessage });
    }
    else if (provider === "selfhosted") {
        url = backendUrl;
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({ input: userMessage });
    }
    const response = yield fetch(url, { method: "POST", headers, body });
    const data = yield response.json();
    return data.choices
        ? data.choices[0].message.content
        : data.output || "Error";
});
exports.AIProvider = AIProvider;
