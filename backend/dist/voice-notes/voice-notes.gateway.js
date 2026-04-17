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
exports.VoiceNotesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const voice_notes_service_1 = require("./voice-notes.service");
let VoiceNotesGateway = class VoiceNotesGateway {
    voiceNotesService;
    server;
    constructor(voiceNotesService) {
        this.voiceNotesService = voiceNotesService;
    }
    async handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        const chats = await this.voiceNotesService.findAllChats();
        client.emit('init_chats', chats);
        const notes = await this.voiceNotesService.findAllVoiceNotes();
        client.emit('init_voicenotes', notes);
    }
    async handleMessage(data) {
        try {
            const newChat = await this.voiceNotesService.createChat(data);
            this.server.emit('new_message', newChat);
        }
        catch (err) {
            console.error('Error saving chat:', err);
        }
    }
    async handleVoiceNote(data) {
        try {
            const newNote = await this.voiceNotesService.createVoiceNote(data);
            this.server.emit('new_voicenote', newNote);
        }
        catch (err) {
            console.error('Error saving voice note:', err);
        }
    }
    async handleRequestInit(data, client) {
        console.log(`📦 Manual refresh requested by: ${client.id}`);
        const notes = await this.voiceNotesService.findAllVoiceNotes();
        client.emit('init_voicenotes', notes);
    }
    async handleDeleteVoiceNote(id) {
        try {
            console.log(`🗑️ Deleting voice note: ${id}`);
            await this.voiceNotesService.deleteVoiceNote(id);
            this.server.emit('deleted_voicenote', id);
        }
        catch (err) {
            console.error('Error deleting note:', err);
        }
    }
};
exports.VoiceNotesGateway = VoiceNotesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], VoiceNotesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VoiceNotesGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_voicenote'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VoiceNotesGateway.prototype, "handleVoiceNote", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request_init'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], VoiceNotesGateway.prototype, "handleRequestInit", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('delete_voicenote'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VoiceNotesGateway.prototype, "handleDeleteVoiceNote", null);
exports.VoiceNotesGateway = VoiceNotesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        maxHttpBufferSize: 1e8,
    }),
    __metadata("design:paramtypes", [voice_notes_service_1.VoiceNotesService])
], VoiceNotesGateway);
//# sourceMappingURL=voice-notes.gateway.js.map