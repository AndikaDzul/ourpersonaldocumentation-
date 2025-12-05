const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS to allow frontend connection
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity (HP lain, localhost, etc)
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8 // Increase buffer for voice notes (100MB)
});

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large payloads for Base64 audio

// --- MONGODB CONNECTION ---
const MONGO_URI = "mongodb+srv://dbuser:dika@cluster0.uk9eamy.mongodb.net/kulineran?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMAS ---
const ChatSchema = new mongoose.Schema({
    sender: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const VoiceNoteSchema = new mongoose.Schema({
    audioData: String, // Base64 string
    duration: Number,
    date: String,
    createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', ChatSchema);
const VoiceNote = mongoose.model('VoiceNote', VoiceNoteSchema);

// --- ROUTES ---
// 1. Get Voice Note as Audio File (for sharing via WA)
app.get('/voice/:id', async (req, res) => {
    try {
        const note = await VoiceNote.findById(req.params.id);
        if (!note) return res.status(404).send('Not found');

        // Convert Base64 (data:audio/mp3;base64,.....) to Buffer
        const base64Data = note.audioData.split(';base64,').pop();
        const imgBuffer = Buffer.from(base64Data, 'base64');

        res.writeHead(200, {
            'Content-Type': 'audio/mp3',
            'Content-Length': imgBuffer.length
        });
        res.end(imgBuffer);
    } catch (err) {
        res.status(500).send(err);
    }
});

// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 1. Initial Load: Send existing data
    Chat.find().sort({ createdAt: 1 }).limit(100).then(chats => {
        socket.emit('init_chats', chats);
    });

    VoiceNote.find().sort({ createdAt: -1 }).limit(20).then(notes => {
        socket.emit('init_voicenotes', notes);
    });

    // 2. Chat Event
    socket.on('send_message', async (data) => {
        try {
            const newChat = new Chat(data);
            await newChat.save();
            // Broadcast to EVERYONE (including sender) for real-time update
            io.emit('new_message', newChat);
        } catch (err) {
            console.error('Error saving chat:', err);
        }
    });

    // 3. Voice Note Event
    socket.on('send_voicenote', async (data) => {
        try {
            const newNote = new VoiceNote(data);
            await newNote.save();
            io.emit('new_voicenote', newNote);
        } catch (err) {
            console.error('Error saving voice note:', err);
        }
    });

    // 4. Delete Voice Note
    socket.on('delete_voicenote', async (id) => {
        try {
            await VoiceNote.findByIdAndDelete(id);
            io.emit('deleted_voicenote', id); // Tell clients to remove it locally
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
