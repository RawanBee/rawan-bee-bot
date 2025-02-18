"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const react_1 = __importStar(require("react"));
const AIProvider_1 = require("./AIProvider");
const StorageManager_1 = require("./StorageManager");
const ChatbotUI = ({ aiProvider = "openai", apiKey, backendUrl, theme = {}, onMessageSend, }) => {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const sendMessage = (text) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, AIProvider_1.AIProvider)(aiProvider, apiKey, backendUrl, text);
        const newMessage = { user: "You", text, bot: response };
        setMessages([...messages, newMessage]);
        // Save message if needed
        if (onMessageSend)
            onMessageSend(newMessage);
        StorageManager_1.StorageManager.save(newMessage);
    });
    return (<div style={{ backgroundColor: theme.bgColor || "#fff", padding: 20 }}>
      {messages.map((msg, index) => (<div key={index}>
          <p>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
          <p>
            <strong>Bot:</strong> {msg.bot}
          </p>
        </div>))}
      <input type="text" placeholder="Type a message..." onKeyDown={(e) => e.key === "Enter" && sendMessage(e.target.value)}/>
    </div>);
};
exports.default = ChatbotUI;
