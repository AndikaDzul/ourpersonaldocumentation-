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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceNotesController = void 0;
const common_1 = require("@nestjs/common");
const express = __importStar(require("express"));
const voice_notes_service_1 = require("./voice-notes.service");
let VoiceNotesController = class VoiceNotesController {
    voiceNotesService;
    constructor(voiceNotesService) {
        this.voiceNotesService = voiceNotesService;
    }
    async getVoiceNote(id, res) {
        try {
            const note = await this.voiceNotesService.findVoiceNoteById(id);
            if (!note) {
                throw new common_1.NotFoundException('Voice note not found');
            }
            const base64Parts = note.audioData.split(';base64,');
            const base64Data = base64Parts.length > 1 ? base64Parts.pop() : base64Parts[0];
            if (!base64Data) {
                throw new common_1.NotFoundException('Audio data is missing');
            }
            const audioBuffer = Buffer.from(base64Data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'audio/mp3',
                'Content-Length': audioBuffer.length,
            });
            res.end(audioBuffer);
        }
        catch (err) {
            console.error('Error fetching voice note:', err);
            res.status(500).send('Internal Server Error');
        }
    }
};
exports.VoiceNotesController = VoiceNotesController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VoiceNotesController.prototype, "getVoiceNote", null);
exports.VoiceNotesController = VoiceNotesController = __decorate([
    (0, common_1.Controller)('voice'),
    __metadata("design:paramtypes", [voice_notes_service_1.VoiceNotesService])
], VoiceNotesController);
//# sourceMappingURL=voice-notes.controller.js.map