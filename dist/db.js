"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentModel = exports.linkModel = exports.Usermodel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
mongoose_1.default.connect("mongodb+srv://yash12:x6LxaQMp9peH1w6P@cluster0.6z7pa.mongodb.net/second-brain");
const userSchema = new mongoose_2.Schema({
    username: { type: String, unique: true },
    password: String,
    email: String
});
exports.Usermodel = (0, mongoose_2.model)("userSchema", userSchema);
const content = new mongoose_2.Schema({
    title: String, // Title of the content
    Link: String,
    type: String, // URL or link to the content
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: "tag" }], // Array of tag IDs, referencing the 'tag' collection
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "userSchema",
        required: true // The 'userId' field is mandatory to link content to a user
    },
});
const link = new mongoose_2.Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'userSchema', required: true, unique: true },
});
exports.linkModel = (0, mongoose_2.model)("links", link);
exports.contentModel = (0, mongoose_2.model)("ContentSchema", content);
