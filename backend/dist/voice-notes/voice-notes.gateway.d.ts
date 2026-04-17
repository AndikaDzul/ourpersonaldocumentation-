import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VoiceNotesService } from './voice-notes.service';
export declare class VoiceNotesGateway implements OnGatewayConnection {
    private readonly voiceNotesService;
    server: Server;
    constructor(voiceNotesService: VoiceNotesService);
    handleConnection(client: Socket): Promise<void>;
    handleMessage(data: any): Promise<void>;
    handleVoiceNote(data: any): Promise<void>;
    handleRequestInit(data: any, client: Socket): Promise<void>;
    handleDeleteVoiceNote(id: string): Promise<void>;
}
