import * as express from 'express';
import { VoiceNotesService } from './voice-notes.service';
export declare class VoiceNotesController {
    private readonly voiceNotesService;
    constructor(voiceNotesService: VoiceNotesService);
    getVoiceNote(id: string, res: express.Response): Promise<void>;
}
