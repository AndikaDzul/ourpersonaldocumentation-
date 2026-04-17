"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceNotesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const voice_notes_service_1 = require("./voice-notes.service");
const voice_notes_controller_1 = require("./voice-notes.controller");
const voice_notes_gateway_1 = require("./voice-notes.gateway");
const voice_note_schema_1 = require("./schemas/voice-note.schema");
let VoiceNotesModule = class VoiceNotesModule {
};
exports.VoiceNotesModule = VoiceNotesModule;
exports.VoiceNotesModule = VoiceNotesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: voice_note_schema_1.VoiceNote.name, schema: voice_note_schema_1.VoiceNoteSchema },
                { name: voice_note_schema_1.Chat.name, schema: voice_note_schema_1.ChatSchema },
            ]),
        ],
        providers: [voice_notes_service_1.VoiceNotesService, voice_notes_gateway_1.VoiceNotesGateway],
        controllers: [voice_notes_controller_1.VoiceNotesController],
    })
], VoiceNotesModule);
//# sourceMappingURL=voice-notes.module.js.map