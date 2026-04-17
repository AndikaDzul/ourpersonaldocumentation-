"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceNotesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const voice_note_schema_1 = require("./schemas/voice-note.schema");
let VoiceNotesService = class VoiceNotesService {
    voiceNoteModel;
    chatModel;
    constructor(voiceNoteModel, chatModel) {
        this.voiceNoteModel = voiceNoteModel;
        this.chatModel = chatModel;
    }
    async findAllChats() {
        return this.chatModel.find().sort({ createdAt: 1 }).limit(100).exec();
    }
    async findAllVoiceNotes() {
        return this.voiceNoteModel.find().sort({ createdAt: -1 }).limit(20).exec();
    }
    async findVoiceNoteById(id) {
        return this.voiceNoteModel.findById(id).exec();
    }
    async createChat(data) {
        const newChat = new this.chatModel(data);
        return newChat.save();
    }
    async createVoiceNote(data) {
        try {
            const newNote = new this.voiceNoteModel(data);
            const savedNote = await newNote.save();
            console.log(`✅ Voice note saved to Atlas: ${savedNote._id}`);
            return savedNote;
        }
        catch (error) {
            console.error('❌ Error saving voice note to Atlas:', error);
            throw error;
        }
    }
    async deleteVoiceNote(id) {
        return this.voiceNoteModel.findByIdAndDelete(id).exec();
    }
};
exports.VoiceNotesService = VoiceNotesService;
exports.VoiceNotesService = VoiceNotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(voice_note_schema_1.VoiceNote.name)),
    __param(1, (0, mongoose_1.InjectModel)(voice_note_schema_1.Chat.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VoiceNotesService);
//# sourceMappingURL=voice-notes.service.js.map