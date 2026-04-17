import { Document } from 'mongoose';
export declare class VoiceNote extends Document {
    audioData: string;
    duration: number;
    date: string;
}
export declare const VoiceNoteSchema: import("mongoose").Schema<VoiceNote, import("mongoose").Model<VoiceNote, any, any, any, any, any, VoiceNote>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VoiceNote, Document<unknown, {}, VoiceNote, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VoiceNote & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    audioData?: import("mongoose").SchemaDefinitionProperty<string, VoiceNote, Document<unknown, {}, VoiceNote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VoiceNote & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    duration?: import("mongoose").SchemaDefinitionProperty<number, VoiceNote, Document<unknown, {}, VoiceNote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VoiceNote & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<string, VoiceNote, Document<unknown, {}, VoiceNote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VoiceNote & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, VoiceNote, Document<unknown, {}, VoiceNote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VoiceNote & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, VoiceNote>;
export declare class Chat extends Document {
    sender: string;
    text: string;
}
export declare const ChatSchema: import("mongoose").Schema<Chat, import("mongoose").Model<Chat, any, any, any, any, any, Chat>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chat, Document<unknown, {}, Chat, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    text?: import("mongoose").SchemaDefinitionProperty<string, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sender?: import("mongoose").SchemaDefinitionProperty<string, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Chat>;
