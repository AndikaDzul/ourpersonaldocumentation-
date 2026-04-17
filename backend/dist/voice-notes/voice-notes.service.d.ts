import { Model } from 'mongoose';
import { VoiceNote, Chat } from './schemas/voice-note.schema';
export declare class VoiceNotesService {
    private voiceNoteModel;
    private chatModel;
    constructor(voiceNoteModel: Model<VoiceNote>, chatModel: Model<Chat>);
    findAllChats(): Promise<(import("mongoose").Document<unknown, {}, Chat, {}, import("mongoose").DefaultSchemaOptions> & Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAllVoiceNotes(): Promise<(import("mongoose").Document<unknown, {}, VoiceNote, {}, import("mongoose").DefaultSchemaOptions> & VoiceNote & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findVoiceNoteById(id: string): Promise<(import("mongoose").Document<unknown, {}, VoiceNote, {}, import("mongoose").DefaultSchemaOptions> & VoiceNote & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    createChat(data: any): Promise<import("mongoose").Document<unknown, {}, Chat, {}, import("mongoose").DefaultSchemaOptions> & Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    createVoiceNote(data: any): Promise<import("mongoose").Document<unknown, {}, VoiceNote, {}, import("mongoose").DefaultSchemaOptions> & VoiceNote & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteVoiceNote(id: string): Promise<(import("mongoose").Document<unknown, {}, VoiceNote, {}, import("mongoose").DefaultSchemaOptions> & VoiceNote & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
