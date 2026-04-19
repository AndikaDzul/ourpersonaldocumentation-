<template>
  <div class="page">
    <!-- Pre-entry Questionnaire Overlay -->
    <Transition name="fade">
      <div v-if="isGlobalLoading" class="global-loading-overlay">
        <div class="loading-content">
          <div class="heart-spinner">💖</div>
          <p class="loading-text">{{ loadingMessage || 'Sedang memproses... ✨' }}</p>
        </div>
      </div>
    </Transition>

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
        <button class="btn-add-memory" @click="showMediaModal = true">
          ✨ Tambah Kenangan
        </button>
      </div>
      
      <div class="gallery-grid">
        <!-- Dynamic Media from API -->
        <div 
          v-for="(m, i) in dynamicPhotos"
          :key="'dyn-'+(m._id || i)"
          class="photo-card dynamic-memory"
          @click="openDynamicMedia(m, i)"
        >
          <div class="img-wrapper">
             <img :src="m.src" :alt="m.title" loading="lazy" />
          </div>
          <div class="photo-overlay">
            <span class="photo-date">Momen Eksklusif</span>
            <h3 class="photo-title">{{ m.title }}</h3>
          </div>
          <!-- Delete Button for Dynamic Photos -->
          <button class="btn-delete-memory" @click.stop="deleteMedia(m._id)">
            <span class="delete-icon">🗑️</span>
          </button>
        </div>

        <!-- Static Photos -->
        <div
          v-for="(p, i) in photos"
          :key="i"
          class="photo-card"
          @click="openLightbox(i + dynamicMedia.filter(x => x.type === 'photo').length, 'photos')"
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
    <!-- Premium Voice Note Section -->
    <section class="section voice-note-section">
      <div class="glass-orb orb-1"></div>
      <div class="glass-orb orb-2"></div>
      
      <div class="section-header">
        <h2 class="section-title">Pesan Suara Sayang 🎤</h2>
        <div class="divider"></div>
        <p class="section-subtitle">Dengarkan suaraku kapan saja kamu rindu. ❤️</p>
        <button class="btn-refresh-premium" @click="refreshVoiceNotes" :disabled="!isConnected">
          <span class="icon">🔄</span> Perbarui Galeri
        </button>
      </div>
      
      <div class="voice-recorder-container-premium">
        <!-- Recorder Card -->
        <div class="recorder-card-premium" :class="{ 'recording-active': isRecording }">
          <div class="recorder-visualizer" v-if="isRecording">
            <div class="wave-bar" v-for="n in 12" :key="n" :style="{ animationDelay: (n * 0.1) + 's' }"></div>
          </div>

          <div class="timer-display-premium">
            <span class="status-text">{{ isRecording ? 'Sedang Merekam...' : 'Ketuk untuk Bicara' }}</span>
            <h3 class="time">{{ isRecording ? recordingDuration + 's' : '00:00' }}</h3>
          </div>
          
          <button 
            class="main-record-btn" 
            :class="{ 'recording': isRecording }" 
            @click="toggleRecording"
          >
            <div class="btn-glow"></div>
            <div class="btn-content">
              <span class="icon">{{ isRecording ? '⏹' : '🎤' }}</span>
            </div>
          </button>
        </div>

        <!-- Voice Notes List (Redesigned as Premium Tags) -->
        <div class="voice-notes-showcase">
          <div 
            v-for="(note, index) in voiceNotes" 
            :key="note.id || index"
            class="voice-tag-premium"
          >
            <div class="tag-left">
              <button class="btn-play-premium" @click="playVoiceNote(note)">
                <span class="play-icon">▶</span>
                <span class="play-text">Dengarkan Pesan 🎧</span>
              </button>
              <div class="tag-info">
                <span class="tag-date">{{ note.date }}</span>
                <span class="tag-duration">⏱ {{ formatDuration(note.duration) }}</span>
              </div>
            </div>
            <button class="tag-delete" @click="deleteVoiceNote(index)">🗑️</button>
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

    <!-- Premium Voice Note Notification -->
    <Transition name="slide-up">
      <div v-if="voiceNotif.show" class="vn-notif" @click="playVoiceNotifNote">
        <div class="vn-notif-glow"></div>
        <div class="vn-notif-icon">
          <div class="vn-pulse"></div>
          🎤
        </div>
        <div class="vn-notif-body">
          <span class="vn-notif-title">Pesan Suara Baru! ✨</span>
          <span class="vn-notif-sub">{{ voiceNotif.date }} &bull; {{ formatDuration(voiceNotif.duration) }}</span>
          <span class="vn-notif-tap">🎧 Ketuk untuk dengarkan</span>
        </div>
        <button class="vn-notif-close" @click.stop="voiceNotif.show = false">×</button>
        <!-- Auto-dismiss progress bar -->
        <div class="vn-progress-bar"></div>
      </div>
    </Transition>

    <!-- Media Upload Modal -->
    <Transition name="fade">
      <div v-if="showMediaModal" class="media-modal-overlay">
        <div class="media-modal-card">
          <button class="modal-close" @click="showMediaModal = false">×</button>
          
          <h2 class="modal-title">✨ Tambah Kenangan</h2>
          <p class="modal-subtitle">Abadikan momen manis kita berdua.</p>

          <div class="media-form">
            <div class="form-group">
              <label>Jenis Media</label>
              <div class="type-selector">
                <button 
                  :class="{ active: mediaForm.type === 'photo' }" 
                  @click="mediaForm.type = 'photo'"
                >📸 Foto</button>
                <button 
                  :class="{ active: mediaForm.type === 'video' }" 
                  @click="mediaForm.type = 'video'"
                >🎥 Video</button>
              </div>
            </div>

            <div class="form-group">
              <label>{{ mediaForm.type === 'photo' ? 'Pilih Foto' : 'Link Video (Cloudinary/YouTube)' }}</label>
              
              <!-- File Upload untuk Foto -->
              <div v-if="mediaForm.type === 'photo'" class="file-upload-wrapper">
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleFileUpload" 
                  id="media-file"
                  class="hidden-input"
                />
                <label for="media-file" class="file-label">
                  {{ mediaForm.url ? '✅ Foto Terpilih' : '📁 Klik untuk Pilih Foto' }}
                </label>
              </div>

              <!-- URL Input untuk Video -->
              <input 
                v-else
                v-model="mediaForm.url" 
                type="text" 
                placeholder="Tempel link video di sini..." 
                class="modal-input"
              />
            </div>

            <div class="form-group">
              <label>Pesan Singkat</label>
              <input 
                v-model="mediaForm.caption" 
                type="text" 
                placeholder="Tulis caption-nya sayang..." 
                class="modal-input"
              />
            </div>

            <div v-if="isUploading" class="upload-loading">
              <div class="spinner"></div>
              <p>Sabar ya sayang, lagi upload... 💖</p>
            </div>

            <button v-else class="btn-save-media" @click="saveMedia">
              💾 Simpan & Kembali
            </button>
            <button class="btn-cancel-modal" @click="showMediaModal = false" :disabled="isUploading">
              Batal
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Video Section -->
    <section ref="videoSection" class="section video-section">
      <div class="section-header">
        <h2 class="section-title">Video Kita</h2>
        <div class="divider"></div>
      </div>
      
      <div class="video-grid">
        <div v-for="(v, i) in allVideos" :key="i" class="video-card-simple">
          <video v-if="v.src && !v.src.includes('youtube.com') && !v.src.includes('youtu.be')" controls preload="metadata">
            <source :src="v.src" type="video/mp4">
            Browser kamu tidak support video.
          </video>
          <!-- Iframe Fallback for YouTube links -->
          <div v-else class="video-iframe-container">
            <iframe :src="v.src.replace('watch?v=', 'embed/')" frameborder="0" allowfullscreen></iframe>
          </div>
          <p v-if="v.title" class="video-caption">{{ v.title }}</p>
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
      <div 
        v-if="lightboxOpen" 
        class="lightbox" 
        @click.self="closeLightbox"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <button class="close-btn" @click="closeLightbox">✕</button>
        <div class="lightbox-content">
          <button class="nav-btn prev" @click.stop="prevImage">‹</button>
          <div class="lightbox-media" @wheel.prevent="handleWheelZoom">
            <img 
              :src="activeImage.src" 
              :alt="activeImage.title" 
              :style="{ transform: 'scale(' + zoomLevel + ')' }"
            />
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Firebase Imports
// Socket.io for Realtime MongoDB
import { io } from "socket.io-client";
import axios from 'axios';

// GANTI URL INI dengan URL dari Localtunnel (HTTPS) agar bisa dibuka di HP
// Contoh: "https://purple-cat-22.loca.lt"
const BACKEND_URL = "https://may-worldd-y8ps.vercel.app"; 
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

// Voice Note Notification State
const voiceNotif = ref({ show: false, note: null, date: '', duration: 0 })
let voiceNotifTimer = null

const playVoiceNotifNote = () => {
  if (voiceNotif.value.note) {
    playVoiceNote(voiceNotif.value.note);
    voiceNotif.value.show = false;
  }
}

const isConnected = ref(false)
const dynamicMedia = ref([])
const showMediaModal = ref(false)
const isUploading = ref(false)
const isGlobalLoading = ref(false)
const loadingMessage = ref('')
const mediaForm = ref({
  type: 'photo', // 'photo' | 'video'
  url: '',
  caption: ''
})

onMounted(() => {
  // Request browser notification permission on startup
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  window.addEventListener('scroll', handleScroll)
  
  // Setup Listeners DULU sebelum konek
  setupSocketListeners()
  
  // Lalu baru konek
  socket.connect()
  
  // Ambil Data Awal
  fetchVoiceNotesREST();
  fetchGallery();

  // Atur Volume Musik Awal (Kecil agar tidak berisik)
  if (audioPlayer.value) {
    audioPlayer.value.volume = 0.3;
  }
  
  // Polling Fallback untuk Vercel (karena Socket.io tidak jalan di Vercel)
  setInterval(() => {
    if (!isConnected.value) {
      console.log("🔄 Socket offline, checking for updates via REST...");
      fetchVoiceNotesREST();
      fetchGallery();
    }
  }, 10000); // Cek setiap 10 detik jika offline
})

// Watcher untuk memastikan volume tetap kecil saat lagu berubah
watch(currentSongIndex, () => {
  setTimeout(() => {
    if (audioPlayer.value) audioPlayer.value.volume = 0.3;
  }, 100);
});

const fetchGallery = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/gallery`);
    if (response.data && Array.isArray(response.data)) {
      dynamicMedia.value = response.data;
    }
  } catch (err) {
    console.error("❌ Gallery Fetch Error:", err.message);
  }
}

const saveMedia = async () => {
  if (!mediaForm.value.url) return showToast("Pilih foto dulu ya! 📸", "warning", "⚠️");

  isGlobalLoading.value = true;
  loadingMessage.value = "Menyimpan kenangan manis... 💖";
  
  try {
    const response = await axios.post(`${BACKEND_URL}/gallery`, mediaForm.value);
    if (response.data) {
      dynamicMedia.value.unshift(response.data);
      
      // Sync to other users via socket
      socket.emit("new_gallery_item", response.data);
      
      showMediaModal.value = false;
      // Reset form
      mediaForm.value = { type: 'photo', url: '', caption: '' };
      showToast("Kenangan kita berhasil disimpan! 💖", "success", "✨");
    }
  } catch (err) {
    console.error("❌ Media Save Error:", err.message);
    const msg = err.response?.status === 413 
      ? "File terlalu besar untuk hosting Vercel. Kompresi otomatis gagal menurunkan ukuran cukup banyak."
      : "Gagal menyimpan kenangan (Database atau Jaringan bermasalah).";
    showToast(msg, "danger", "❌");
  } finally {
    isGlobalLoading.value = false;
    loadingMessage.value = "";
  }
}

const deleteMedia = async (id) => {
  if (!confirm("Hapus kenangan ini sayang? 🥺")) return;
  
  isGlobalLoading.value = true;
  loadingMessage.value = "Menghapus kenangan... 🗑️";
  
  try {
    const response = await axios.delete(`${BACKEND_URL}/gallery/${id}`);
    if (response.status === 200 || response.status === 204) {
      dynamicMedia.value = dynamicMedia.value.filter(m => (m._id || m.id) !== id);
      // Sync to other users via socket
      socket.emit("delete_gallery_item", id);
      
      showToast("Kenangan sudah dihapus. 🗑️", "info", "✨");
    }
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    showToast("Gagal menghapus. Coba lagi ya!", "danger", "❌");
  } finally {
    isGlobalLoading.value = false;
    loadingMessage.value = "";
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (isUploading.value) return; // Prevent double trigger

  try {
    isUploading.value = true;
    let finalFile = file;

    // Foto Otomatis Dikompres jika tipe image
    if (file.type.startsWith('image/')) {
      showToast("Mengoptimalkan foto... ✨", "info", "⚙️");
      finalFile = await compressImage(file);
      console.log(`📸 Photo optimized: ${file.size} -> ${finalFile.size}`);
    } else if (file.type.startsWith('video/')) {
       // Video check (Vercel has 4.5MB total limit)
       if (file.size > 4 * 1024 * 1024) {
         alert("⚠️ Video terlalu besar untuk Vercel (Max 4MB). Coba video lebih pendek ya sayang!");
         event.target.value = '';
         isUploading.value = false;
         return;
       }
    }

    const base64 = await blobToBase64(finalFile);
    mediaForm.value.url = base64;
    
    // ONE-CLICK UPLOAD: Langsung panggil saveMedia
    showToast("Sedang mengupload... 🚀", "info", "☁️");
    await saveMedia();
    
    // Clear input so same file can be selected again
    event.target.value = '';
  } catch (err) {
    console.error("File Optimization Error:", err);
    showToast("Gagal memproses file.", "danger", "❌");
    isUploading.value = false;
  }
}

const fetchVoiceNotesREST = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/voicenotes`);
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
    console.log("🔆 New voicenote received:", note._id);
    const mappedNote = {
      ...note,
      id: note._id,
      url: note.audioData
    };
    voiceNotes.value.unshift(mappedNote);

    // Show premium in-app notification popup
    voiceNotif.value = {
      show: true,
      note: mappedNote,
      date: note.date || 'Baru saja',
      duration: note.duration || 0
    };

    // Native browser push notification
    if (Notification.permission === 'granted') {
      new Notification('🎤 Pesan Suara Baru dari Sayang!', {
        body: `Ada voice note masuk — Ketuk untuk dengarkan 🎧`,
        icon: '/favicon.ico'
      });
    }

    // Auto-dismiss after 10 seconds
    clearTimeout(voiceNotifTimer);
    voiceNotifTimer = setTimeout(() => {
      voiceNotif.value.show = false;
    }, 10000);
  });

  socket.on("deleted_voicenote", (id) => {
    voiceNotes.value = voiceNotes.value.filter(n => n.id !== id && n._id !== id);
  });

  // Real-time Gallery Listeners
  socket.on("added_gallery_item", (item) => {
    console.log("📸 New gallery item synced:", item._id);
    const exists = dynamicMedia.value.some(m => m._id === item._id);
    if (!exists) dynamicMedia.value.unshift(item);
  });

  socket.on("removed_gallery_item", (id) => {
    console.log("🗑️ Gallery item deleted:", id);
    dynamicMedia.value = dynamicMedia.value.filter(m => (m._id || m.id) !== id);
  });
}

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const refreshVoiceNotes = () => {
  fetchVoiceNotesREST();
  showToast("Menyegarkan galeri...", "info", "🔄");
}

const playVoiceNote = (note) => {
  if (!note.url) return showToast("File suara tidak ditemukan.", "error", "❌");
  
  // Ducking: Kecilkan volume musik saat voice note diputar
  if (audioPlayer.value) audioPlayer.value.volume = 0.1;

  // Play love sound effect first
  const doll = new Audio(dollVoice);
  doll.volume = 0.5;
  doll.play().catch(() => {});

  const audio = new Audio(note.url);
  audio.volume = 1.0; // Pastikan volume MAKSIMAL
  
  console.log("🔊 Memutar audio dari:", note.url.substring(0, 50) + "...");
  
  audio.play().then(() => {
    showToast("Memutar pesan suara... 🎵", "success", "🎶");
  }).catch(e => {
    console.error("❌ Audio Playback Error:", e);
    showToast("Gagal memutar suara. Pastikan speaker menyala!", "error", "❌");
    // Kembalikan volume jika gagal
    if (audioPlayer.value) audioPlayer.value.volume = 0.3;
  });

  // Saat voice note selesai, kembalikan volume musik
  audio.onended = () => {
    if (audioPlayer.value) audioPlayer.value.volume = 0.3;
  }
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
const dynamicPhotos = computed(() => {
  return dynamicMedia.value
    .filter(m => m.type === 'photo')
    .map(m => ({ 
      src: m.url, 
      title: m.caption || 'Momen Baru', 
      date: 'Baru Saja', 
      desc: m.caption || 'Kenangan baru yang diabadikan.',
      isDynamic: true,
      _id: m._id || m.id
    }));
})

const dynamicVideos = computed(() => {
  return dynamicMedia.value
    .filter(m => m.type === 'video')
    .map(m => ({ src: m.url, title: m.caption, _id: m._id || m.id }));
})

const allPhotos = computed(() => [...dynamicPhotos.value, ...photos.value])
const allVideos = computed(() => [...dynamicVideos.value, ...videos.value])

const activeList = computed(() => activeSource.value === 'photos' ? allPhotos.value : trending.value)
const activeImage = computed(() => activeList.value[currentIdx.value] || {})

const openLightbox = (index, source) => {
  // Play love sound
  const audio = new Audio(dollVoice)
  audio.play().catch(e => console.log('Error playing sound:', e))

  activeSource.value = source
  currentIdx.value = index
  lightboxOpen.value = true
  resetZoom()
  document.body.style.overflow = 'hidden'
}

const openDynamicMedia = (media, index) => {
  if (media.type === 'video') {
    // Play love sound
    const audio = new Audio(dollVoice)
    audio.play().catch(e => console.log('Error playing sound:', e))
    window.open(media.url, '_blank');
  } else {
    // Jika foto, buka di Lightbox pakai list terpadu
    // index dikirim dari v-for dynamicMedia
    openLightbox(index, 'photos');
  }
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const zoomLevel = ref(1)

const resetZoom = () => {
  zoomLevel.value = 1
}

const handleWheelZoom = (e) => {
  if (e.deltaY < 0) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 3)
  } else {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
  }
}

// Swipe & Gesture Logic
const touchStartX = ref(0)
const touchEndX = ref(0)
const initialPinchDistance = ref(0)

const handleTouchStart = (e) => {
  if (e.touches.length === 1) {
    touchStartX.value = e.touches[0].clientX
  } else if (e.touches.length === 2) {
    initialPinchDistance.value = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    )
  }
}

const handleTouchMove = (e) => {
  if (e.touches.length === 2) {
    const currentDistance = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    )
    const delta = currentDistance / initialPinchDistance.value
    // Dynamic Zoom Control
    zoomLevel.value = Math.min(Math.max(zoomLevel.value * delta, 0.5), 3)
    initialPinchDistance.value = currentDistance
  }
}

const handleTouchEnd = (e) => {
  if (e.changedTouches.length === 1) {
    touchEndX.value = e.changedTouches[0].clientX
    handleSwipe()
  }
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) nextImage() // Swipe Left -> Next
    else prevImage() // Swipe Right -> Prev
  }
}

const nextImage = () => {
  currentIdx.value = (currentIdx.value + 1) % activeList.value.length
  resetZoom()
}

const prevImage = () => {
  currentIdx.value = (currentIdx.value - 1 + activeList.value.length) % activeList.value.length
  resetZoom()
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

// Helper: Image Compression (Resize & Quality)
const compressImage = (file, maxWidth = 1080, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if too wide
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

const saveVoiceNoteToDB = async (audioBlob, duration) => {
  try {
    const base64Data = await blobToBase64(audioBlob);
    
    // Kirim ke server via REST API (Vercel compatible)
    const payload = {
      audioData: base64Data,
      duration: duration,
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const response = await axios.post(`${BACKEND_URL}/voicenotes`, payload);
    
    if (response.data) {
      console.log("✅ Voice note saved via REST");
      // Update list lokal agar langsung muncul
      voiceNotes.value.unshift({
        ...response.data,
        id: response.data._id,
        url: response.data.audioData
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error saving voice note:", error);
    alert("Gagal menyimpan: " + (error.response?.data?.message || error.message));
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
  const allCurrentPhotos = [...photos.value, ...photos.value, ...photos.value, ...photos.value]
  
  // Progressive Loading for Galaxy Stars (prevent lag)
  let index = 0;
  const CHUNK_SIZE = 10;
  
  const generateStars = () => {
    const nextChunk = allCurrentPhotos.slice(index, index + CHUNK_SIZE);
    if (nextChunk.length === 0) return;

    const newStars = nextChunk.map(p => {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 600 + Math.random() * 400;

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
    });

    starPhotos.value.push(...newStars);
    index += CHUNK_SIZE;
    
    if (index < allCurrentPhotos.length) {
      requestAnimationFrame(generateStars);
    }
  };

  requestAnimationFrame(generateStars);
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

/* --- New Premium Gallery Styles --- */
.btn-add-memory {
  background: linear-gradient(45deg, var(--primary), #ff9a9e);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
  box-shadow: 0 4px 15px rgba(255, 133, 162, 0.3);
  transition: 0.3s;
}
.btn-add-memory:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 133, 162, 0.5);
}

.media-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.media-modal-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 30px;
  width: 100%;
  max-width: 450px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.5);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
}

.modal-title {
  font-family: 'Dancing Script', cursive;
  font-size: 2.2rem;
  color: var(--primary);
  margin-bottom: 5px;
}

.modal-subtitle {
  color: #666;
  margin-bottom: 25px;
}

.media-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.type-selector {
  display: flex;
  gap: 10px;
}

.type-selector button {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid #eee;
  background: white;
  cursor: pointer;
  transition: 0.2s;
}

.type-selector button.active {
  border-color: var(--primary);
  background: var(--accent);
  color: var(--primary);
}

.modal-input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #eee;
  outline: none;
  transition: 0.3s;
}

.modal-input:focus {
  border-color: var(--primary);
}

.btn-save-media {
  background: var(--primary);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

/* --- Premium Voice Note Overhaul --- */
.voice-recorder-container-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin-top: 30px;
}

.recorder-card-premium {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  padding: 40px;
  border-radius: 40px;
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 15px 35px rgba(0,0,0,0.05);
  transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.recorder-card-premium.recording-active {
  transform: scale(1.05);
  background: rgba(255, 133, 162, 0.1);
  box-shadow: 0 20px 50px rgba(255, 133, 162, 0.2);
}

.recorder-visualizer {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  margin-bottom: 20px;
}

.wave-bar {
  width: 4px;
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  animation: waveGrow 0.8s ease-in-out infinite alternate;
}

@keyframes waveGrow {
  from { transform: scaleY(0.2); }
  to { transform: scaleY(1); }
}

.timer-display-premium {
  text-align: center;
  margin-bottom: 30px;
}

.status-text {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
}

.time {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 5px 0;
}

.main-record-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: white;
  cursor: pointer;
  position: relative;
  transition: 0.3s;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.main-record-btn.recording {
  background: #ff4d4d;
  color: white;
}

.btn-glow {
  position: absolute;
  inset: -10px;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(15px);
  animation: pulseRotate 2s linear infinite;
}

.btn-content .icon {
  font-size: 2rem;
}

/* Voice Note Showcase (Premium Tags) */
.voice-notes-showcase {
  width: 100%;
  max-width: 600px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.voice-tag-premium {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  padding: 12px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: 0.3s;
}

.voice-tag-premium:hover {
  transform: translateY(-3px);
  background: white;
  box-shadow: 0 10px 20px rgba(255, 133, 162, 0.15);
}

.btn-play-premium {
  background: linear-gradient(45deg, var(--primary), #ff9a9e);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
  font-weight: 600;
  font-size: 0.8rem;
  box-shadow: 0 4px 10px rgba(255, 133, 162, 0.3);
}

.btn-play-premium:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(255, 133, 162, 0.5);
}

.play-icon {
  font-size: 0.7rem;
}

.tag-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 5px;
}

.tag-date {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
}

.tag-duration {
  font-size: 0.7rem;
  opacity: 0.7;
}

.tag-delete {
  background: none;
  border: none;
  cursor: pointer;
  filter: grayscale(1);
  opacity: 0.5;
  transition: 0.3s;
}

.tag-delete:hover {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.2);
}

@keyframes pulseRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.video-placeholder {
  width: 100%;
  height: 100%;
  background: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-refresh-premium {
  background: rgba(255, 133, 162, 0.1);
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 8px 15px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.btn-refresh-premium:hover {
  background: var(--primary);
  color: white;
}

.file-upload-wrapper {
  width: 100%;
}

.hidden-input {
  display: none;
}

.file-label {
  display: block;
  width: 100%;
  padding: 15px;
  background: #f8f8f8;
  border: 2px dashed #ddd;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  color: #666;
}

.file-label:hover {
  border-color: var(--primary);
  background: var(--accent);
  color: var(--primary);
}
.btn-cancel-modal {
  background: #eee;
  color: #666;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 5px;
  transition: 0.3s;
}

.btn-cancel-modal:hover {
  background: #e0e0e0;
  color: #333;
}

.video-caption {
  font-size: 0.8rem;
  margin-top: 10px;
  color: #888;
  font-style: italic;
}

.video-iframe-container {
  aspect-ratio: 16/9;
  width: 100%;
}

.video-iframe-container iframe {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}

/* Animations perbaikan */
.photo-card {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}

.photo-card:hover {
  transform: translateY(-8px) scale(1.02);
  z-index: 10;
}

.voice-tag-premium {
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 133, 162, 0.2);
}

.voice-tag-premium:active {
  transform: scale(0.95);
}

/* Delete Button for Gallery */
.btn-delete-memory {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0;
  transform: translateY(-10px);
}

.photo-card:hover .btn-delete-memory {
  opacity: 1;
  transform: translateY(0);
}

.btn-delete-memory:hover {
  background: #ff4d6d;
  color: white;
  transform: scale(1.1) rotate(15deg) !important;
  box-shadow: 0 5px 15px rgba(255, 77, 109, 0.4);
}

.delete-icon {
  font-size: 16px;
}

/* Upload Loading */
.upload-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
  padding: 20px;
  background: rgba(255, 133, 162, 0.1);
  border-radius: 20px;
  animation: pulse 2s infinite;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 133, 162, 0.2);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.98); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* Global Loading Overlay */
.global-loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 183, 206, 0.7);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.loading-content {
  background: white;
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 15px 50px rgba(255, 77, 136, 0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  border: 4px solid var(--primary);
}

.heart-spinner {
  font-size: 4rem;
  animation: heartBeat 0.8s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  40% { transform: scale(1); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.loading-text {
  font-family: 'Dancing Script', cursive;
  font-size: 1.8rem;
  color: var(--primary);
  font-weight: 700;
}

.hidden-input {
  display: none;
}

/* ==========================================
   VOICE NOTE NOTIFICATION POPUP (Premium)
   ========================================== */
.vn-notif {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: min(420px, 92vw);
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 50px rgba(255, 77, 136, 0.35), 0 0 0 1px rgba(255, 133, 162, 0.2);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  cursor: pointer;
  z-index: 9998;
  overflow: hidden;
  border: 2px solid rgba(255, 133, 162, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.vn-notif:hover {
  transform: translateX(-50%) translateY(-4px);
  box-shadow: 0 16px 60px rgba(255, 77, 136, 0.45);
}

.vn-notif-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 181, 206, 0.15), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.vn-notif-icon {
  position: relative;
  font-size: 2.4rem;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd6e5, #ffb3cd);
  border-radius: 50%;
}

.vn-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 3px solid var(--primary);
  animation: vnPulse 1.5s ease-out infinite;
}

@keyframes vnPulse {
  0%   { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

.vn-notif-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
}

.vn-notif-title {
  font-family: 'Dancing Script', cursive;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vn-notif-sub {
  font-size: 0.78rem;
  color: #888;
  font-weight: 500;
}

.vn-notif-tap {
  font-size: 0.8rem;
  color: var(--primary);
  font-weight: 600;
  animation: tapBlink 2s ease infinite;
}

@keyframes tapBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.vn-notif-close {
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.1rem;
  color: #aaa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  line-height: 1;
}

.vn-notif-close:hover {
  background: #ffd6e5;
  color: var(--primary);
}

/* Slide-up animation for notification */
.slide-up-enter-active {
  animation: slideUpIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-up-leave-active {
  animation: slideDownOut 0.3s ease forwards;
}

@keyframes slideUpIn {
  from { transform: translateX(-50%) translateY(120%); opacity: 0; }
  to   { transform: translateX(-50%) translateY(0);   opacity: 1; }
}

@keyframes slideDownOut {
  from { transform: translateX(-50%) translateY(0);   opacity: 1; }
  to   { transform: translateX(-50%) translateY(120%); opacity: 0; }
}

/* Auto-dismiss progress bar */
.vn-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--primary), #ff9a9e);
  border-radius: 0 0 24px 24px;
  transform-origin: left center;
  animation: shrinkProgress 10s linear forwards;
}

@keyframes shrinkProgress {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}
</style>
