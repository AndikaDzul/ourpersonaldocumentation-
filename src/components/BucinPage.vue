<template>
  <div class="page">
    <!-- Pre-entry Questionnaire Overlay -->
    <Transition name="fade">
      <div v-if="showQuestionnaire" class="question-overlay">
        <div class="question-box">
          <!-- Step 1: Do you like me? -->
          <div v-if="questionStep === 1" class="question-step">
            <h2 class="question-title">Hai kamu! Jawab jujur ya... 🌸</h2>
            <p class="question-text">Apakah kamu menyukaiku?<br><span class="sub-text">(Do you like me?)</span></p>
            <div class="btn-group">
              <button class="btn-yes" @click="nextQuestion">Suka (Yes) 💖</button>
              <button class="btn-no" @mouseover="moveButton" @click="handleReject">Enggak (No) 😝</button>
            </div>
          </div>

          <!-- Step 2: Do you miss me? -->
          <div v-else-if="questionStep === 2" class="question-step">
            <h2 class="question-title">Aww makasih! 🥰</h2>
            <p class="question-text">Apakah kamu sangat kangen kepadaku?<br><span class="sub-text">(Do you miss me a lot?)</span></p>
            <div class="btn-group">
              <button class="btn-yes" @click="nextQuestion">Kangen Banget! (Miss so much) 🥺</button>
              <button class="btn-no" @click="handleLittleMiss">Biasa aja (Just a little) 😒</button>
            </div>
          </div>

          <!-- Step 3: Percentage -->
          <div v-else-if="questionStep === 3" class="question-step">
            <h2 class="question-title">Terakhir nih... ✨</h2>
            <p class="question-text">Seberapa persen kamu kangen ke aku?<br><span class="sub-text">(What percentage do you miss me?)</span></p>
            
            <div class="slider-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model="missPercentage" 
                class="heart-slider"
              >
              <div class="percentage-display">{{ missPercentage }}%</div>
            </div>

            <p v-if="missPercentage < 50" class="hint-text">Kok dikit banget? Tambahin dong! 😤</p>
            <p v-if="missPercentage >= 50 && missPercentage < 100" class="hint-text">Kurang polll! 😆</p>
            <p v-if="missPercentage == 100" class="hint-text">Nah gitu dong! I love you! 😍</p>

            <button 
              class="btn-submit" 
              :disabled="missPercentage < 100"
              :class="{ 'disabled': missPercentage < 100 }"
              @click="finishQuestionnaire"
            >
              Kirim Jawaban (Submit) 💌
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating Hearts Background -->
    <div class="floating-hearts">
      <div v-for="n in 20" :key="n" class="heart" :style="getHeartStyle(n)">❤️</div>
    </div>

    <!-- Cursor & Click Effects -->
    <div class="effects-container">
      <div 
        v-for="p in particles" 
        :key="p.id" 
        class="particle"
        :style="{ 
          left: p.x + 'px', 
          top: p.y + 'px', 
          fontSize: p.size + 'px',
          opacity: p.life 
        }"
      >
        {{ p.emoji }}
      </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="brand">
        <span class="heart-icon">💖</span> KitaSelamanya
        <div class="connection-status" :class="{ 'online': isConnected }" :title="isConnected ? 'Server Online' : 'Server Offline'">
          <span class="status-dot"></span>
          {{ isConnected ? 'Online' : 'Offline' }}
        </div>
      </div>
      <ul class="nav-links">
        <li><button class="btn-ghost" @click="scrollToSection('gallery')">Galeri</button></li>
        <li><button class="btn-ghost" @click="scrollToSection('videos')">Video</button></li>
        <li><button class="btn-ghost" @click="scrollToSection('story')">Cerita</button></li>
      </ul>
    </nav>

    <!-- Hero -->
    <header class="hero">
      <div class="hero-bg"></div>
      
      <!-- 3D Animated Text -->
      <div class="love-text-container">
        <h1 class="love-text-3d">I Love You Baby <span class="love-icon">💖</span></h1>
      </div>

      <div class="hero-content">
        <h1 class="title-animate">Our Love Story</h1>
        <p class="subtitle-animate">Dunia terasa lebih indah saat ada kamu 🌸</p>
        <button class="btn-primary glow-effect" @click="scrollToSection('gallery')">
          Lihat Kenangan Kita
        </button>
      </div>
      
      <!-- Animated Doll -->
      <div class="doll-container">
        <div v-if="showLoveBubble" class="love-bubble">
          I Love You! 💖
        </div>
        <img 
          :src="dollImage" 
          alt="Cute Doll" 
          class="cute-doll" 
          @click="playDollVoice"
          title="Klik aku!"
        />
      </div>

      <div class="scroll-indicator">
        <span>💕</span>
      </div>
    </header>

    <!-- NEW: 3D Love Wall Animation -->
    <section class="section threed-section">
      <!-- 3D Container -->
      <div class="love-wall-container">
        <div class="love-wall">
          <!-- Looping Rows -->
          <div v-for="row in 20" :key="'row-'+row" class="wall-row" :class="{'even': row % 2 === 0}">
            <span class="wall-text">I LOVE YOU BABYY 💖</span>
            <div v-if="row % 3 === 0" class="wall-photo-frame">
              <img :src="photos[row % photos.length].src" alt="Love" />
            </div>
            <span class="wall-text">MWAHHH 💋</span>
            <div v-if="row % 4 === 0" class="wall-photo-frame">
              <img :src="photos[(row + 2) % photos.length].src" alt="Love" />
            </div>
            <span class="wall-text">FOREVER ❤️</span>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW: 3D Galaxy/Planet Section -->
    <section class="section galaxy-section" @mousemove="handleGalaxyMove" @wheel="handleGalaxyZoom">
      <div class="galaxy-scene" :style="galaxyStyle">
        <!-- Center Planet -->
        <div class="planet">
          <div class="planet-body"></div>
          <div class="planet-ring">
            <span>Kamu orang special,kamu duniakuu</span>
          </div>
        </div>

        <!-- Floating Photos -->
        <div 
          v-for="(photo, i) in starPhotos" 
          :key="'star-'+i" 
          class="star-photo"
          :style="photo.style"
        >
          <img :src="photo.src" loading="lazy" />
        </div>
      </div>
      
      <div class="galaxy-controls">
        <p>Gunakan Mouse/Scroll untuk Zoom & Putar 🌍✨</p>
      </div>
    </section>

    <!-- Music Player -->
    <div class="music-player" :class="{ 'playing': isPlaying }">
      <div class="disk-wrapper">
        <div class="disk" :style="{ animationPlayState: isPlaying ? 'running' : 'paused' }">
          <div class="disk-center"></div>
        </div>
      </div>
      
      <div class="player-controls">
        <button class="control-btn" @click="prevSong">⏮</button>
        <button class="play-btn" @click="toggleMusic">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="control-btn" @click="nextSong">⏭</button>
      </div>

      <div class="player-info">
        <span class="song-title">{{ currentSong.title }}</span>
        <span class="artist">{{ currentSong.artist }}</span>
      </div>

      <audio ref="audioPlayer" :src="currentSong.src" loop @ended="nextSong"></audio>
    </div>

    <!-- Galeri Foto -->
    <section ref="gallerySection" class="section gallery-section">
      <div class="section-header">
        <h2 class="section-title">Momen Manis</h2>
        <div class="divider"></div>
      </div>
      
      <div class="gallery-grid">
        <div
          v-for="(p, i) in photos"
          :key="i"
          class="photo-card"
          @click="openLightbox(i, 'photos')"
        >
          <div class="img-wrapper">
            <img :src="p.src" :alt="p.title" loading="lazy" />
          </div>
          <div class="photo-overlay">
            <span class="photo-date">{{ p.date }}</span>
            <h3 class="photo-title">{{ p.title }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Voice Note Section -->
    <section class="section voice-note-section">
      <div class="glass-orb orb-1"></div>
      <div class="glass-orb orb-2"></div>
      
      <div class="section-header">
        <h2 class="section-title">Pesan Suara Sayang 🎤</h2>
        <div class="divider"></div>
        <p class="section-subtitle">Disimpan selamanya di galeri cinta kita agar bisa kamu putar sesukamu. ❤️</p>
        <button class="btn-refresh" @click="refreshVoiceNotes" :disabled="!isConnected">
          🔄 Muat Ulang Galeri
        </button>
      </div>
      
      <div class="voice-recorder-container">
        <div class="recorder-card">
          <div class="recorder-controls">
            <div class="timer-display" :class="{ 'active': isRecording }">
              <span class="pulse-dot" v-if="isRecording"></span>
              {{ isRecording ? recordingDuration + 's' : 'Siap merekam...' }}
            </div>
            
            <button 
              class="record-btn-premium" 
              :class="{ 'recording': isRecording }" 
              @click="toggleRecording"
            >
              <div class="btn-inner">
                <span class="mic-icon">{{ isRecording ? '⬛' : '🎤' }}</span>
              </div>
              <div class="pulse-rings" v-if="isRecording">
                <div class="ring"></div>
                <div class="ring"></div>
              </div>
            </button>
            <p class="recorder-hint">{{ isRecording ? 'Klik untuk berhenti' : 'Klik untuk mulai merekam' }}</p>
          </div>

          <div class="voice-list-container">
            <TransitionGroup name="list" tag="div" class="voice-list">
              <div v-for="(voice, index) in voiceNotes" :key="voice.id || index" class="voice-item-premium">
                <div class="voice-card-bg"></div>
                <div class="voice-info">
                  <span class="voice-date">📅 {{ voice.date }}</span>
                  <span class="voice-duration-tag">⏱️ {{ voice.duration }}s</span>
                </div>
                
                <div class="audio-wrapper">
                  <audio controls :src="voice.url" class="custom-audio-player"></audio>
                </div>

                <button class="delete-btn-premium" @click="deleteVoiceNote(index)" title="Hapus Permanen">
                  <span class="trash-icon">🗑️</span>
                </button>
              </div>
            </TransitionGroup>
            
            <div v-if="voiceNotes.length === 0" class="empty-state-premium">
              <div class="empty-icon">📂</div>
              <p>Belum ada rekaman. Yuk rekam pesan pertamamu! ✨</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notification Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="love-toast" :class="toast.type">
        <span class="toast-icon">{{ toast.icon }}</span>
        <span class="toast-msg">{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Video Section -->
    <section ref="videoSection" class="section video-section">
      <div class="section-header">
        <h2 class="section-title">Video Kita</h2>
        <div class="divider"></div>
      </div>
      
      <div class="video-grid">
        <div v-for="(v, i) in videos" :key="i" class="video-card-simple">
          <video controls preload="metadata">
            <source :src="v.src" type="video/mp4">
            Browser kamu tidak support video.
          </video>
        </div>
      </div>
    </section>

    <!-- Trending / Highlights -->
    <section class="section highlight-section">
      <div class="section-header">
        <h2 class="section-title">Highlight</h2>
        <div class="divider"></div>
      </div>
      <div class="highlight-carousel">
        <div v-for="(trend, i) in trending" :key="i" class="highlight-card" @click="openLightbox(i, 'trending')">
          <img :src="trend.src" :alt="trend.title" />
          <div class="highlight-content">
            <h3>{{ trend.title }}</h3>
            <p>{{ trend.desc }}</p>
            <div class="stats">
              <span>❤️ {{ trend.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cerita -->
    <section ref="storySection" class="section story-section">
      <div class="story-container">
        <h2 class="section-title">Cerita Kita</h2>
        <p class="story-text">
          "Sayang, kalau aku bisa memutar waktu, aku akan mencarimu lebih awal, supaya aku bisa mencintaimu lebih lama. Terima kasih sudah hadir dan mengubah duniaku yang biasa saja menjadi luar biasa. Kamu bukan hanya sekadar pasangan, tapi rumah ternyaman tempatku pulang. 
          
          Di setiap tawa kita, di setiap tatapan matamu, aku menemukan alasan kenapa aku harus bersyukur setiap bangun tidur. Mungkin aku nggak sempurna, aku banyak kurangnya, tapi satu hal yang pasti: cintaku ke kamu itu tulus dan nggak akan pernah pudar. 
          
          Terima kasih sudah menerima aku apa adanya, sudah sabar menghadapiku. Aku janji akan terus berusaha membahagiakanmu, karena senyummu adalah duniaku. I love you more than words can say. Selamanya. ❤️"
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>Dibuat dengan penuh Cinta 💖 untukmu By Andikaa.</p>
    </footer>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
        <button class="close-btn" @click="closeLightbox">✕</button>
        <div class="lightbox-content">
          <button class="nav-btn prev" @click.stop="prevImage">‹</button>
          <div class="lightbox-media">
            <img :src="activeImage.src" :alt="activeImage.title" />
            <div class="lightbox-details">
              <h3>{{ activeImage.title }}</h3>
              <p>{{ activeImage.desc }}</p>
            </div>
          </div>
          <button class="nav-btn next" @click.stop="nextImage">›</button>
        </div>
      </div>
    </Transition>
    <!-- WhatsApp Voice Note Modal -->
    <Transition name="fade">
      <div v-if="showWAModal" class="modal-overlay">
        <div class="modal-box">
          <h3>Kirim Voice Note ke Siapa? 📲</h3>
          <p>Pilih nomor WhatsApp tujuan:</p>
          
          <input 
            v-model="waMessage" 
            placeholder="Ketik pesan tambahan (misal: Sayang kangen...)" 
            class="wa-input"
          />

          <div class="btn-group-vertical">
            <button class="btn-wa" @click="sendToWA('6281322233928')">
              Nomor 1 (0813-2223-3928)
            </button>
            <button class="btn-wa" @click="sendToWA('6281928615681')">
              Nomor 2 (0819-2861-5681)
            </button>
            <button class="btn-cancel" @click="showWAModal = false">Batalkan</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Firebase Imports
// Socket.io for Realtime MongoDB
import { io } from "socket.io-client";
import axios from 'axios';

// GANTI URL INI dengan URL dari Localtunnel (HTTPS) agar bisa dibuka di HP
// Contoh: "https://purple-cat-22.loca.lt"
const BACKEND_URL = "http://localhost:3000"; 
// TIPS: Jika buka di HP, ganti "localhost" di atas dengan IP komputer kamu (misal: 192.168.1.5)

const socket = io(BACKEND_URL, {
  autoConnect: false, // Kita akan konek secara manual di onMounted
  reconnectionAttempts: 5,
  timeout: 10000
});

// Assets Import
// Assets Import
import bgMusicFile from '../assets/The 1975 - About You (Official) - The1975VEVO.mp3'
import bgMusicFile2 from '../assets/night_changes.mp3'
import dollVoiceFile from '../assets/doll_voice.mp3'

// Photos
import foto1 from '../assets/foto1.jpg'
import foto2 from '../assets/foto2.jpg'
import foto3 from '../assets/foto3.jpg'
import foto4 from '../assets/foto4.jpg'
import foto5 from '../assets/foto5.jpg'
import foto6 from '../assets/foto6.jpg'
import kita1 from '../assets/kita1.jpg'
import kita2 from '../assets/kita2.jpg'
import kita3 from '../assets/kita3.jpg'
import kita4 from '../assets/kita4.jpg'
import kita5 from '../assets/kita5.jpg'
import kita6 from '../assets/kita6.jpg'
import kita7 from '../assets/kita7.jpg'
import kita13 from '../assets/kita13.jpg'
import kita41 from '../assets/kita41.jpg'
import kita42 from '../assets/kita42.jpg'
import kita43 from '../assets/kita43.jpg'
import kita44 from '../assets/kita44.jpg'

// Videos
import video8 from '../assets/kita8.mp4'
import video9 from '../assets/kita9.mp4'
import video10 from '../assets/kita10.mp4'
import video12 from '../assets/kita12.mp4'
import video14 from '../assets/kita14.mp4'
import video16 from '../assets/kita16.mp4'
import video17 from '../assets/kita17.mp4'
import video18 from '../assets/kita18.mp4'
import cuteDoll from '../assets/cute_doll_transparent_1764947393310.png'

const dollImage = cuteDoll
const dollVoice = dollVoiceFile

// Playlist Data
const playlist = [
  { title: 'About You', artist: 'The 1975', src: bgMusicFile },
  { title: 'Night Changes', artist: 'One Direction', src: bgMusicFile2 }
]

// Data
const photos = ref([
  { src: kita13, title: 'Spesial', date: 'Momen Kita', desc: 'Senyummu mengalihkan duniaku.' },
  { src: kita1, title: 'Awal Cerita', date: 'Day 1', desc: 'Pertemuan yang tak terlupakan.' },
  { src: kita2, title: 'Jalan-jalan', date: 'Weekend', desc: 'Menikmati hari minggu bersamamu.' },
  { src: kita3, title: 'Sweet Moment', date: 'Date Night', desc: 'Makan Ice Cream Berdua .' },
  { src: kita4, title: 'Candid', date: 'Random', desc: 'Kamu cantik apa adanya.' },
  { src: kita5, title: 'Ice cream', date: 'Holiday', desc: 'Kenapa ya hatiku dag dig dug bila deket kamu.' },
  { src: kita6, title: 'Sunset', date: 'Sore Itu', desc: 'Menunggu matahari terbenam.' },
  { src: kita7, title: 'Bahagia', date: 'Forever', desc: 'Semoga selamanya seperti ini.' },
  { src: foto1, title: 'Estetik', date: 'Vibes', desc: 'Ada gula ga.' },
  { src: foto2, title: 'Warmth', date: 'Cozy', desc: 'Kamu orangnya suka ngangenin.' },
  { src: foto3, title: 'Laugh', date: 'Happy', desc: 'Tawamu canduku.' },
  { src: foto4, title: 'Together', date: 'Us', desc: 'Kita lawan dunia.' },
  { src: foto5, title: 'Dream', date: 'Future', desc: 'Mimpi-mimpi kita.' },
  { src: foto6, title: 'Memory', date: 'Throwback', desc: 'Mengingat masa lalu.' },
    { src: kita41, title: 'Beach', date: 'Beautiful', desc: 'Kenangan ketika di maliboro Yogyakarta.' },
    { src: kita42, title: 'Beach', date: 'Beautiful', desc: 'Kenangan ketika di maliboro Yogyakarta.' },
        { src: kita43, title: 'Baybe', date: 'Happy', desc: 'Kenangan ketika di maliboro Yogyakarta sore ituu.' },
                { src: kita44, title: 'Romance ', date: 'Us', desc: 'Lucu banget deh kita berdua awww.' },
        
  
])

const videos = ref([
  { src: video8, title: 'Vlog Mini', desc: 'Keseruan kita hari ini!' },
  { src: video9, title: 'Tiktok Bareng', desc: 'Iseng-iseng berhadiah.' },
  { src: video10, title: 'Trip Singkat', desc: 'Jalan-jalan dadakan.' },
  { src: video12, title: 'Anniversary', desc: 'Merayakan hari jadi kita.' },
  { src: video14, title: 'Anniversary', desc: 'Hal Random.' },
    { src: video16, title: 'Anniversary', desc: 'Jalan jalan dengan pacar.' },
      { src: video17, title: 'Anniversary', desc: 'Jalan jalan dengan pacar.' },
        { src: video18, title: 'Tiktok Bareng', desc: 'Iseng-iseng berhadiah.' },
])

const trending = ref([
  { src: kita13, title: 'Best Photo', desc: 'Paling favorit!', likes: 9999 },
  { src: kita2, title: 'Cute', desc: 'Gemes banget.', likes: 8888 },
  { src: kita7, title: 'Goals', desc: 'Couple goals katanya.', likes: 7777 },
])

// State
const showQuestionnaire = ref(true)
const questionStep = ref(1)
const missPercentage = ref(50)

// Questionnaire Logic
const nextQuestion = () => {
  questionStep.value++
}

const handleReject = () => {
  alert("Eits gaboleh nolak! Harus suka dong! 😤")
}

const moveButton = (e) => {
  const btn = e.target
  const x = Math.random() * (window.innerWidth - btn.offsetWidth)
  const y = Math.random() * (window.innerHeight - btn.offsetHeight)
  
  // Make sure it doesn't go off screen
  btn.style.position = 'fixed'
  btn.style.left = `${Math.max(0, Math.min(x, window.innerWidth - 100))}px`
  btn.style.top = `${Math.max(0, Math.min(y, window.innerHeight - 50))}px`
}

const handleLittleMiss = () => {
  alert("Parah banget masa cuma biasa aja! 😭 Ulangi!")
}

const finishQuestionnaire = () => {
  showQuestionnaire.value = false
  // Play music automatically when entering
  setTimeout(() => {
    toggleMusic()
    playDollVoice()
  }, 500)
}

const isScrolled = ref(false)
const isPlaying = ref(false)
const audioPlayer = ref(null)
const lightboxOpen = ref(false)
const currentIdx = ref(0)
const activeSource = ref('photos') // 'photos' | 'trending'

// Music State
const currentSongIndex = ref(0)
const currentSong = computed(() => playlist[currentSongIndex.value])

// Scroll Handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const isConnected = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Setup Listeners DULU sebelum konek
  setupSocketListeners()
  
  // Lalu baru konek
  socket.connect()
  
  // Polling Fallback untuk Vercel (karena Socket.io tidak jalan di Vercel)
  setInterval(() => {
    if (!isConnected.value) {
      console.log("🔄 Socket offline, checking for updates via REST...");
      fetchVoiceNotesREST();
    }
  }, 10000); // Cek setiap 10 detik jika offline
})

const fetchVoiceNotesREST = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/voice/list`);
    if (response.data && Array.isArray(response.data)) {
      console.log("📦 Received voicenotes via REST:", response.data.length);
      voiceNotes.value = response.data.map(n => ({
        ...n,
        id: n._id,
        url: n.audioData
      }));
    }
  } catch (err) {
    console.error("❌ REST Fallback Error:", err.message);
  }
}

const setupSocketListeners = () => {
  socket.on("connect", () => {
    console.log("✅ Socket Connected to Backend");
    isConnected.value = true;
    // Ambil data awal setiap kali konek
    socket.emit("get_init_data"); // Opsional: trigger manual jika backend support
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected");
    isConnected.value = false;
  });

  socket.on("connect_error", (err) => {
    console.error("⚠️ Socket Connection Error:", err.message);
    isConnected.value = false;
  });

  // Data Listeners
  socket.on("init_voicenotes", (notes) => {
    console.log("📦 Received voicenotes init:", notes.length);
    voiceNotes.value = notes.map(n => ({
      ...n,
      id: n._id,
      url: n.audioData
    }));
  });

  socket.on("new_voicenote", (note) => {
    console.log("🆕 New voicenote received:", note._id);
    voiceNotes.value.unshift({ 
      ...note,
      id: note._id,
      url: note.audioData
    });
  });

  socket.on("deleted_voicenote", (id) => {
    voiceNotes.value = voiceNotes.value.filter(n => n.id !== id && n._id !== id);
  });
}

const refreshVoiceNotes = () => {
  fetchVoiceNotesREST();
  showToast("Menyegarkan galeri...", "info", "🔄");
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Music Control
const toggleMusic = () => {
  if (!audioPlayer.value) return
  if (isPlaying.value) {
    audioPlayer.value.pause()
  } else {
    audioPlayer.value.play().catch(e => console.log('Autoplay prevented', e))
  }
  isPlaying.value = !isPlaying.value
}

const nextSong = () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % playlist.length
  isPlaying.value = false // Reset play state to trigger auto-play logic if needed, or just let watcher handle it
  setTimeout(() => {
    if (audioPlayer.value) {
      audioPlayer.value.play()
      isPlaying.value = true
    }
  }, 100)
}

const prevSong = () => {
  currentSongIndex.value = (currentSongIndex.value - 1 + playlist.length) % playlist.length
  setTimeout(() => {
    if (audioPlayer.value) {
      audioPlayer.value.play()
      isPlaying.value = true
    }
  }, 100)
}

// Navigation
const gallerySection = ref(null)
const videoSection = ref(null)
const storySection = ref(null)

const scrollToSection = (section) => {
  const el = {
    gallery: gallerySection,
    videos: videoSection,
    story: storySection
  }[section]
  
  el.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Lightbox
const activeList = computed(() => activeSource.value === 'photos' ? photos.value : trending.value)
const activeImage = computed(() => activeList.value[currentIdx.value] || {})

const openLightbox = (index, source) => {
  // Play love sound
  const audio = new Audio(dollVoice)
  audio.play().catch(e => console.log('Error playing sound:', e))

  activeSource.value = source
  currentIdx.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  currentIdx.value = (currentIdx.value + 1) % activeList.value.length
}

const prevImage = () => {
  currentIdx.value = (currentIdx.value - 1 + activeList.value.length) % activeList.value.length
}

// Voice Note Logic
const isRecording = ref(false)
const mediaRecorder = ref(null)
const audioChunks = ref([])
const voiceNotes = ref([])
const recordingDuration = ref(0)
let recordingTimer = null

// Toast Logic
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  icon: '💖'
})

const showToast = (msg, type = 'success', icon = '💖') => {
  toast.value = { show: true, message: msg, type, icon }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// loadVoiceNotes lama dihapus karena sudah dipindah ke setupSocketListeners

// Helper: Blob to Base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const saveVoiceNoteToDB = async (audioBlob, duration) => {
  try {
    const base64Data = await blobToBase64(audioBlob);
    
    // Kirim ke server via Socket
    socket.emit("send_voicenote", {
      audioData: base64Data,
      duration: duration,
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    
    return true; /* Return true to indicate success */
  } catch (error) {
    console.error("Error saving voice note:", error);
    alert("Gagal menyimpan server offline?");
    return false;
  }
}

const deleteVoiceNoteFromDB = async (note) => {
  if (!socket) return;
  const id = note.id || note._id;
  socket.emit("delete_voicenote", id);
}

const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    await startRecording()
  }
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(stream)
    audioChunks.value = []

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/mp3' })
      
      const success = await saveVoiceNoteToDB(audioBlob, recordingDuration.value)
      
      if (success) {
        // Voice note tersimpan otomatis ke database
        showToast("Pesan suara sudah tersimpan di galeri! 💖", "success", "💌");
      }
      
      recordingDuration.value = 0
    }

    mediaRecorder.value.start()
    isRecording.value = true
    
    recordingTimer = setInterval(() => {
      recordingDuration.value++
    }, 1000)

  } catch (error) {
    console.error('Error accessing microphone:', error)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      alert('Gagal mengakses mikrofon! 🎤\n\nVoice Note hanya jalan di localhost atau HTTPS.')
    } else {
      alert('Maaf, tidak bisa mengakses mikrofon. Izinkan akses dulu ya! 🎤')
    }
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
    clearInterval(recordingTimer)
    
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop())
  }
}

const deleteVoiceNote = async (index) => {
  const note = voiceNotes.value[index]
  if (confirm("Yakin mau hapus pesan ini secara permanen?")) {
    await deleteVoiceNoteFromDB(note)
    showToast("Pesan suara sudah dihapus.", "info", "🗑️")
  }
}

// Floating Hearts Logic
const getHeartStyle = () => {
  const delay = Math.random() * 5
  const duration = 5 + Math.random() * 5
  const left = Math.random() * 100
  const size = 10 + Math.random() * 20
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    fontSize: `${size}px`
  }
}

const showLoveBubble = ref(false)

const playDollVoice = () => {
  const audio = new Audio(dollVoice)
  audio.play().catch(e => console.log('Error playing doll voice:', e))
  
  showLoveBubble.value = true
  setTimeout(() => {
    showLoveBubble.value = false
  }, 3000)
}



// WhatsApp Logic
const showWAModal = ref(false)
const latestNoteId = ref(null)
const waMessage = ref('')

// Tangkap ID note baru dari socket agar bisa dikirim link-nya
socket.on("new_voicenote", (note) => {
  latestNoteId.value = note._id; // Simpan ID terakhir untuk fitur WA manual jika dibutuhkan
});

const sendToWA = (number) => {
  if (!latestNoteId.value) {
    alert("Tunggu sebentar, voice note sedang diproses...");
    return;
  }
  
  // Gunakan URL server yang sudah disetting di atas
  const link = `${BACKEND_URL}/voice/${latestNoteId.value}`;
  
  // Gabungkan Link + Pesan Tambahan
  const text = `${link}\n\n${waMessage.value}`;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  
  window.open(url, '_blank');
  showWAModal.value = false;
  waMessage.value = ''; // Reset pesan
}

// --- Galaxy 3D Logic ---
const starPhotos = ref([])
const galaxyRotate = ref({ x: 0, y: 0 })
const galaxyZoom = ref(-500) // Initial Zoom (far enough to see everything)

onMounted(() => {
  // Generate many photos for the galaxy (duplicate existing photos)
  const allPhotos = [...photos.value, ...photos.value, ...photos.value, ...photos.value] // x4 amount
  
  starPhotos.value = allPhotos.map(p => {
    // Spherical Distribution
    const theta = Math.random() * 2 * Math.PI; // Random angle around
    const phi = Math.acos((Math.random() * 2) - 1); // Random angle up/down
    const radius = 600 + Math.random() * 400; // Distance from center (600px - 1000px)

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return {
      src: p.src,
      style: {
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
        animationDelay: `${Math.random() * 5}s`
      }
    }
  })
})

const galaxyStyle = computed(() => {
  return {
    transform: `translateZ(${galaxyZoom.value}px) rotateY(${galaxyRotate.value.y}deg) rotateX(${galaxyRotate.value.x}deg)`
  }
})

const handleGalaxyMove = (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2
  const y = (e.clientY / window.innerHeight - 0.5) * 2
  
  galaxyRotate.value = {
    x: -y * 20, // Rotate X based on mouse Y
    y: x * 50   // Rotate Y based on mouse X
  }
}

const handleGalaxyZoom = (e) => {
  // Simple zoom limitation
  const newZoom = galaxyZoom.value - e.deltaY * 0.5
  if (newZoom < -2000) galaxyZoom.value = -2000
  else if (newZoom > 500) galaxyZoom.value = 500
  else galaxyZoom.value = newZoom
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Outfit:wght@300;400;600&display=swap');

:root {
  --primary: #ff85a2; /* Cute Pink */
  --secondary: #ffb7ce; /* Soft Pink */
  --accent: #fff0f5; /* Lavender Blush */
  --text: #5e2a40; /* Dark Pink/Brown for text */
  --glass: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.4);
  --dark-glass: rgba(0, 0, 0, 0.1);
}

.page {
  /* Pink Lucu Gradient */
  background: linear-gradient(180deg, #ffdde1 0%, #ee9ca7 100%);
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Questionnaire Overlay */
.question-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 183, 206, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.question-box {
  background: white;
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(255, 77, 136, 0.3);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 4px solid #fff;
  outline: 4px solid var(--primary);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.question-title {
  font-family: 'Dancing Script', cursive;
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 20px;
}

.question-text {
  font-size: 1.4rem;
  color: var(--text);
  margin-bottom: 30px;
  font-weight: 600;
  line-height: 1.4;
}

.sub-text {
  font-size: 1rem;
  font-weight: 400;
  color: #888;
  display: block;
  margin-top: 5px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-yes, .btn-no, .btn-submit {
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  font-family: 'Outfit', sans-serif;
}

.btn-yes {
  background: var(--primary);
  color: white;
  box-shadow: 0 5px 15px rgba(255, 133, 162, 0.4);
}

.btn-yes:hover, .btn-submit:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 133, 162, 0.6);
}

.btn-no {
  background: #f0f0f0;
  color: #666;
}

.btn-submit {
  background: linear-gradient(45deg, var(--primary), #ff9a9e);
  color: white;
  margin-top: 20px;
  width: 100%;
}

.btn-submit.disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Slider Styling */
.slider-container {
  margin: 30px 0;
}

.heart-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 10px;
  background: #ffd1dc;
  outline: none;
  opacity: 0.7;
  transition: .2s;
}

.heart-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 35px;
  height: 35px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff4d88'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>") no-repeat center center;
  cursor: pointer;
  transition: 0.2s;
}

.heart-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.percentage-display {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-top: 10px;
  font-family: 'Dancing Script', cursive;
}

.hint-text {
  font-size: 0.9rem;
  color: #ff4d88;
  margin-top: -15px;
  margin-bottom: 20px;
  font-weight: 600;
  animation: bounce 1s infinite;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: 0.3s ease;
}
.navbar.scrolled {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 15px 40px;
  box-shadow: 0 4px 20px rgba(255, 133, 162, 0.2);
}
.brand {
  font-family: 'Dancing Script', cursive;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}
.heart-icon {
  animation: beat 1.5s infinite;
}
@keyframes beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
}
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}
.btn-ghost:hover {
  color: var(--primary);
  background: rgba(255, 255, 255, 0.5);
}

/* Hero */
.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: url('../assets/foto1.jpg') center/cover no-repeat;
  filter: brightness(0.6) blur(3px);
  transform: scale(1.1);
  animation: zoomBg 20s infinite alternate;
}
@keyframes zoomBg {
  from { transform: scale(1.1); }
  to { transform: scale(1.2); }
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border-radius: 30px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}
.title-animate {
  font-family: 'Dancing Script', cursive;
  font-size: 5rem;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 4px 15px rgba(255, 77, 136, 0.6);
  animation: fadeInDown 1.2s ease-out;
}
.subtitle-animate {
  font-size: 1.4rem;
  margin-bottom: 40px;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 2px 5px rgba(0,0,0,0.2);
  animation: fadeInUp 1.2s ease-out 0.3s backwards;
}
.btn-primary {
  background: linear-gradient(45deg, var(--primary), #ff9a9e);
  border: none;
  padding: 14px 40px;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 5px 15px rgba(255, 133, 162, 0.4);
  animation: fadeInUp 1.2s ease-out 0.6s backwards;
}
.btn-primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 133, 162, 0.6);
}
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  animation: bounce 2s infinite;
  font-size: 2rem;
  opacity: 0.8;
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Music Player */
.music-player {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  z-index: 999;
  border: 1px solid var(--glass-border);
  transition: 0.3s;
}
.music-player:hover {
  transform: scale(1.05);
}
.disk-wrapper {
  width: 40px;
  height: 40px;
}
.disk {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #333, #000);
  border-radius: 50%;
  position: relative;
  animation: spin 3s linear infinite;
  animation-play-state: paused;
  border: 2px solid var(--primary);
}
.disk-center {
  position: absolute;
  inset: 12px;
  background: var(--primary);
  border-radius: 50%;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.player-info {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}
.song-title {
  font-weight: 700;
  color: var(--primary);
}
.artist {
  color: var(--text);
}
.player-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.control-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--primary);
  transition: 0.2s;
}
.control-btn:hover {
  transform: scale(1.2);
}
.play-btn {
  background: var(--primary);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  box-shadow: 0 4px 10px rgba(255, 133, 162, 0.3);
  font-size: 1.2rem;
}
.play-btn:hover {
  transform: scale(1.1);
}

/* Sections */
.section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.section-header {
  text-align: center;
  margin-bottom: 60px;
}
.section-title {
  font-family: 'Dancing Script', cursive;
  font-size: 3.5rem;
  color: var(--primary);
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.05);
}
.divider {
  width: 80px;
  height: 5px;
  background: var(--primary);
  margin: 0 auto;
  border-radius: 10px;
}

/* Gallery Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}
.photo-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  height: 350px;
  transition: 0.4s ease;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  background: #fff;
}
.photo-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(255, 133, 162, 0.2);
}
.img-wrapper {
  width: 100%;
  height: 100%;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
}
.photo-card:hover img {
  transform: scale(1.1);
}
.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(255, 77, 136, 0.8), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  opacity: 0;
  transition: 0.3s;
}
.photo-card:hover .photo-overlay {
  opacity: 1;
}
.photo-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  font-family: 'Dancing Script', cursive;
}
.photo-date {
  font-size: 0.9rem;
  color: #fff;
  margin-bottom: 5px;
  font-weight: 600;
}

/* Video Section - Simple */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}
.video-card-simple {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 10px;
}
.video-card-simple video {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 15px;
  background: #000;
}

/* Highlight Carousel */
.highlight-carousel {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding-bottom: 20px;
  scroll-snap-type: x mandatory;
}
.highlight-carousel::-webkit-scrollbar {
  height: 8px;
}
.highlight-carousel::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}
.highlight-card {
  min-width: 280px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  scroll-snap-align: center;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.highlight-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.highlight-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #fff;
}

/* Story */
.story-container {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  padding: 60px;
  border-radius: 30px;
  text-align: center;
  border: 2px solid #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(255, 133, 162, 0.15);
}
.story-container::before {
  content: '"';
  font-family: 'Dancing Script', cursive;
  font-size: 10rem;
  position: absolute;
  top: -20px;
  left: 20px;
  color: rgba(255, 133, 162, 0.2);
}
.story-text {
  font-size: 1.6rem;
  line-height: 1.8;
  font-style: italic;
  max-width: 800px;
  margin: 0 auto;
  color: var(--text);
}

/* Footer */
.footer {
  text-align: center;
  padding: 40px;
  opacity: 0.8;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-content {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}
.lightbox-media {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.lightbox-media img {
  max-height: 80vh;
  max-width: 100%;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(255, 133, 162, 0.3);
}
.lightbox-details {
  text-align: center;
}
.lightbox-details h3 {
  color: var(--primary);
  font-size: 2rem;
  margin-bottom: 5px;
  font-family: 'Dancing Script', cursive;
}
.lightbox-details p {
  color: var(--text);
}
.nav-btn {
  background: rgba(255, 133, 162, 0.2);
  border: none;
  color: var(--primary);
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
}
.nav-btn:hover {
  background: var(--primary);
  color: #fff;
}
.close-btn {
  position: absolute;
  top: 30px;
  right: 30px;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 2rem;
  cursor: pointer;
  transition: 0.3s;
}
.close-btn:hover {
  color: var(--primary);
  transform: rotate(90deg);
}

/* Animations */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 3D Text Animation */
.love-text-container {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  animation: floatDown 3s ease-in-out infinite alternate;
}

.love-text-3d {
  font-family: 'Dancing Script', cursive;
  font-size: 4rem;
  color: #ff4d88;
  text-shadow: 
    0 1px 0 #ccc,
    0 2px 0 #c9c9c9,
    0 3px 0 #bbb,
    0 4px 0 #b9b9b9,
    0 5px 0 #aaa,
    0 6px 1px rgba(0,0,0,.1),
    0 0 5px rgba(0,0,0,.1),
    0 1px 3px rgba(0,0,0,.3),
    0 3px 5px rgba(0,0,0,.2),
    0 5px 10px rgba(0,0,0,.25),
    0 10px 10px rgba(0,0,0,.2),
    0 20px 20px rgba(0,0,0,.15);
  margin: 0;
  line-height: 1.2;
}

.love-icon {
  font-size: 3rem;
  display: block;
  animation: beat 1s infinite;
  margin-top: 10px;
}

@keyframes floatDown {
  0% { transform: translateX(-50%) translateY(0); }
  100% { transform: translateX(-50%) translateY(20px); }
}

/* Doll Animation */
.doll-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 5;
}

.cute-doll {
  width: 150px;
  height: auto;
  animation: peek 5s infinite;
  filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2));
  cursor: pointer;
  transition: 0.3s;
}
.cute-doll:active {
  transform: scale(0.9) rotate(-10deg);
}

.love-bubble {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-family: 'Dancing Script', cursive;
  font-size: 1.5rem;
  color: var(--primary);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  white-space: nowrap;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.love-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

@keyframes popIn {
  from { transform: translateX(-50%) scale(0); opacity: 0; }
  to { transform: translateX(-50%) scale(1); opacity: 1; }
}

@keyframes peek {
  0%, 100% { transform: rotate(-5deg) translateY(0); }
  50% { transform: rotate(5deg) translateY(-10px); }
}

/* Floating Hearts */
.floating-hearts {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.heart {
  position: absolute;
  bottom: -50px;
  opacity: 0;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  10% { opacity: 0.8; }
  100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
}

/* Responsive */
@media (max-width: 768px) {
  .title-animate { font-size: 3rem; }
  .navbar { padding: 15px 20px; }
  .nav-links { display: none; }
  .music-player { bottom: 20px; right: 20px; padding: 10px 15px; }
  .disk-wrapper { display: none; }
  .story-text { font-size: 1.2rem; }
  .love-text-3d { font-size: 2.5rem; }
  .cute-doll { width: 100px; bottom: 80px; }
}
/* WA Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.btn-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.btn-wa {
  background: #25D366;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s;
}

.btn-wa:hover {
  background: #128C7E;
  transform: scale(1.05);
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
  padding: 10px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
}

.wa-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 15px;
  margin: 15px 0;
  font-family: inherit;
  outline: none;
  transition: 0.3s;
}

.wa-input:focus {
  border-color: #25D366;
  box-shadow: 0 0 10px rgba(37, 211, 102, 0.2);
}

/* 3D Love Wall Styles */
.threed-section {
  position: relative;
  height: 100vh;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.love-wall-container {
  width: 100%;
  height: 120%;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(20deg) scale(1.2); /* Miringkan agar terlihat 3D */
}

.love-wall {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  animation: scrollDown 20s linear infinite;
  width: 100%;
}

.wall-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  white-space: nowrap;
  width: 200%; /* Lebar ekstra untuk scrolling horizontal jika mau */
}

.wall-row.even {
  transform: translateX(-50px);
}

.wall-text {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: 3rem;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 10px rgba(255, 77, 136, 0.5);
  font-style: italic;
  letter-spacing: 2px;
}

.wall-photo-frame {
  width: 150px;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  border: 4px solid white;
  box-shadow: 0 0 20px rgba(255, 77, 136, 0.8);
  transform: rotate(5deg);
}

.wall-photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.even .wall-photo-frame {
  transform: rotate(-5deg);
}

@keyframes scrollDown {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0%); }
}

/* Responsive 3D */
@media (max-width: 768px) {
  .wall-text { font-size: 1.5rem; -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8); }
  .wall-photo-frame { width: 100px; height: 140px; }
  .threed-section { height: 60vh; }
}
/* Galaxy Section */
.galaxy-section {
  height: 100vh;
  background: radial-gradient(circle at center, #1a0b14 0%, #000000 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1500px;
  position: relative;
  cursor: grab;
}

.galaxy-scene {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Planet */
.planet {
  position: absolute;
  transform-style: preserve-3d;
  animation: spinPlanet 20s linear infinite;
}

.planet-body {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 30% 30%, #ff85a2, #ff4d88, #5e2a40);
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(255, 77, 136, 0.8), inset -20px -20px 50px rgba(0,0,0,0.5);
}

.planet-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 350px;
  height: 350px;
  border: 4px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotateX(75deg);
  box-shadow: 0 0 20px rgba(255, 77, 136, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.planet-ring span {
  position: absolute;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 5px;
  animation: counterSpin 20s linear infinite;
  text-shadow: 0 0 10px #ff4d88;
}

/* Stars / Photos */
.star-photo {
  position: absolute;
  width: 80px;
  height: 80px;
  /* background: white; */
  padding: 3px;
  /* border-radius: 5px; */
  /* transform-style: preserve-3d; */
  /* backface-visibility: hidden; */ /* Keep visible 360 */
  animation: floatStar 3s ease-in-out infinite alternate;
}

.star-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.galaxy-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  pointer-events: none;
}

/* Animations */
@keyframes spinPlanet {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

@keyframes counterSpin {
  0% { transform: rotateZ(0deg); }
  100% { transform: rotateZ(-360deg); }
}

@keyframes floatStar {
  0% { margin-top: -5px; }
  100% { margin-top: 5px; }
}

/* Hide scrollbar for clean look */
.galaxy-section::-webkit-scrollbar {
  display: none;
}
/* Connection Status UI */
.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 15px;
  transition: 0.3s;
  color: #888;
}

.connection-status.online {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #ccc;
  border-radius: 50%;
}

.online .status-dot {
  background: #4CAF50;
  box-shadow: 0 0 10px #4CAF50;
}

.btn-refresh {
  background: white;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.2s;
  color: #666;
}

.btn-refresh:hover:not(:disabled) {
  background: #f9f9f9;
  transform: translateY(-2px);
  border-color: var(--primary);
  color: var(--primary);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

/* Voice Note Premium Styles */
.voice-note-section {
  position: relative;
  background: linear-gradient(135deg, #fff5f7 0%, #fff 100%);
  padding-bottom: 100px;
  overflow: hidden;
}

.recorder-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(255, 77, 136, 0.1);
  max-width: 900px;
  margin: 0 auto;
}

.recorder-controls {
  text-align: center;
  margin-bottom: 50px;
}

.timer-display {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #666;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
}

.timer-display.active {
  color: var(--primary);
  transform: scale(1.1);
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.record-btn-premium {
  position: relative;
  width: 100px;
  height: 100px;
  border: none;
  background: transparent;
  cursor: pointer;
  margin-bottom: 15px;
}

.btn-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 10px 25px rgba(255, 77, 136, 0.2);
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 2;
}

.record-btn-premium.recording .btn-inner {
  background: var(--primary);
  color: white;
  transform: scale(0.9);
}

.pulse-rings .ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid var(--primary);
  border-radius: 50%;
  animation: ripple 1.5s infinite;
  opacity: 0;
}

.pulse-rings .ring:nth-child(2) {
  animation-delay: 0.5s;
}

@keyframes ripple {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}

.voice-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.voice-item-premium {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: 0.3s;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.voice-item-premium:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 77, 136, 0.15);
  border-color: rgba(255, 77, 136, 0.2);
}

.voice-card-bg {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 77, 136, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.voice-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: #888;
  font-weight: 500;
}

.voice-duration-tag {
  color: var(--primary);
  background: rgba(255, 77, 136, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.audio-wrapper {
  margin-bottom: 10px;
}

.custom-audio-player {
  width: 100%;
  height: 35px;
  border-radius: 30px;
}

.delete-btn-premium {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: 0.3s;
  font-size: 1.2rem;
}

.voice-item-premium:hover .delete-btn-premium {
  opacity: 1;
}

.delete-btn-premium:hover {
  transform: scale(1.2) rotate(10deg);
}

/* Toast Notification */
.love-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(45, 45, 45, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 10000;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  font-weight: 600;
}

.toast-icon { font-size: 1.3rem; }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 20px) scale(0.8); }

/* Animation Utils */
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.9); }

.empty-state-premium {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  filter: grayscale(1);
  opacity: 0.3;
}

.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: -1;
}

.orb-1 {
  top: 10%;
  left: -5%;
  width: 300px;
  height: 300px;
  background: rgba(255, 77, 136, 0.1);
}

.orb-2 {
  bottom: 10%;
  right: -5%;
  width: 400px;
  height: 400px;
  background: rgba(255, 133, 162, 0.15);
}

@media (max-width: 600px) {
  .recorder-card { padding: 20px; }
  .voice-list { grid-template-columns: 1fr; }
}
</style>
