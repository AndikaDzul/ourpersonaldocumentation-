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
      <div class="section-header">
        <h2 class="section-title">Voice Note Untukmu Untuk Menyembuhkan Rasa Kangenn </h2>
        <div class="divider"></div>
      </div>
      
      <div class="voice-recorder-container">
        <div class="recorder-controls">
          <button 
            class="record-btn" 
            :class="{ 'recording': isRecording }" 
            @click="toggleRecording"
          >
            <span class="mic-icon">{{ isRecording ? '⬛' : '🎤' }}</span>
            {{ isRecording ? 'Stop Recording' : 'Rekam Pesan' }}
          </button>
          <p v-if="isRecording" class="recording-status">Sedang merekam... {{ recordingDuration }}s</p>
        </div>

        <div class="voice-list">
          <div v-for="(voice, index) in voiceNotes" :key="index" class="voice-item">
            <div class="voice-info">
              <span class="voice-date">{{ voice.date }}</span>
              <span class="voice-duration">{{ voice.duration }}s</span>
            </div>
            <audio controls :src="voice.url" class="custom-audio"></audio>
            <button class="delete-btn" @click="deleteVoiceNote(index)">🗑️</button>
          </div>
          <p v-if="voiceNotes.length === 0" class="empty-state">Belum ada pesan suara. Rekam sekarang! 🎤</p>
        </div>
      </div>
    </section>

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
          "Terima kasih sudah mewarnai hari-hariku dengan warna pink yang indah. 
          Kamu adalah alasan kenapa aku selalu tersenyum setiap hari. I Love You! 💖"
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
    <!-- Cloud Chat Widget -->
    <div class="chat-widget">
      <button class="chat-toggle-btn" @click="toggleChat">
        <span class="chat-icon">💬</span>
        <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </button>

      <Transition name="slide-up">
        <div v-if="isChatOpen" class="chat-window">
          <div class="chat-header">
            <h3>Obrolan Kita 💑</h3>
            <button class="close-chat" @click="toggleChat">✕</button>
          </div>
          
          <div class="chat-messages" ref="chatContainer">
            <div v-if="!userName" class="name-setup">
              <p>Siapa nama kamu sayang?</p>
              <input v-model="tempName" @keyup.enter="saveName" placeholder="Tulis namamu..." />
              <button @click="saveName">Masuk Chat</button>
            </div>

            <template v-else>
               <div v-if="chatMessages.length === 0" class="empty-chat">
                Belum ada pesan. Mulai ngobrol yuk! 👋
              </div>
              <div 
                v-for="msg in chatMessages" 
                :key="msg.id" 
                class="message-bubble"
                :class="{ 'my-message': msg.sender === userName, 'their-message': msg.sender !== userName }"
              >
                <div class="message-content">
                  <span class="message-sender">{{ msg.sender }}</span>
                  <p>{{ msg.text }}</p>
                  <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
                </div>
              </div>
            </template>
          </div>

          <div v-if="userName" class="chat-input-area">
            <input 
              v-model="newMessage" 
              @keyup.enter="sendMessage"
              placeholder="Ketik pesan sayang..." 
            />
            <button @click="sendMessage">
              <span class="send-icon">🚀</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Firebase Imports
// Firebase Imports
import { storage, db } from '../firebase'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { collection, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp, onSnapshot, limit } from "firebase/firestore"

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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadVoiceNotes()
  initChat()
})

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

const loadVoiceNotes = async () => {
  if (!db) return
  // Gunakan onSnapshot untuk Real-time Updates (Bisa lihat suara orang lain langsung)
  const q = query(collection(db, "voiceNotes"), orderBy("createdAt", "desc"));
  
  onSnapshot(q, (snapshot) => {
    voiceNotes.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }, (error) => {
    console.error("Error loading voice notes:", error);
  });
}

const saveVoiceNoteToDB = async (audioBlob, duration) => {
  if (!storage || !db) {
    alert("⚠️ FITUR BELUM DI-CONFIG! \n\nAgar pesan suara bisa tersimpan online, kamu harus setting 'src/firebase.js' dulu ya! \n(Cek file tersebut untuk caranya)");
    return false;
  }

  try {
    const filename = `voicenotes/${Date.now()}.mp3`;
    const audioRef = storageRef(storage, filename);
    
    // Upload Blob
    await uploadBytes(audioRef, audioBlob);
    const downloadURL = await getDownloadURL(audioRef);
    
    // Save Metadata to Firestore
    await addDoc(collection(db, "voiceNotes"), {
      url: downloadURL,
      storagePath: filename,
      duration: duration,
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      createdAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error saving voice note:", error);
    alert("Gagal menyimpan: " + error.code);
    return false;
  }
}

const deleteVoiceNoteFromDB = async (note) => {
  if (!db || !storage) return;
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "voiceNotes", note.id));
    
    // Delete from Storage
    if (note.storagePath) {
      const fileRef = storageRef(storage, note.storagePath);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.error("Error deleting:", error);
    alert("Gagal menghapus: " + error.message);
  }
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
      
      // Save directly to Firebase
      const success = await saveVoiceNoteToDB(audioBlob, recordingDuration.value)
      
      if (success) {
        // loadVoiceNotes() // Tidak perlu dipanggil manual lagi karena sudah pakai onSnapshot
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
  if (confirm("Yakin mau hapus pesan ini?")) {
    await deleteVoiceNoteFromDB(note)
    // loadVoiceNotes() // Auto updated by snapshot
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

// Chat Logic
const isChatOpen = ref(false)
const chatMessages = ref([])
const newMessage = ref('')
const userName = ref(localStorage.getItem('bucin_username') || '')
const tempName = ref('')
const unreadCount = ref(0)
const chatContainer = ref(null)

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    unreadCount.value = 0
    scrollToBottom()
  }
}

const saveName = () => {
  if (tempName.value.trim()) {
    userName.value = tempName.value.trim()
    localStorage.setItem('bucin_username', userName.value)
  }
}

const initChat = () => {
  if (!db) return

  const q = query(collection(db, "chats"), orderBy("createdAt", "asc"), limit(100))
  
  onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    chatMessages.value = msgs
    
    if (!isChatOpen.value && msgs.length > 0) {
      // Simple logic: if new message comes and chat is closed, increment badge
      // In real app we compare IDs, but here just simple visual cue
      unreadCount.value++
    }
    
    scrollToBottom()
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !db) return

  try {
    await addDoc(collection(db, "chats"), {
      text: newMessage.value.trim(),
      sender: userName.value,
      createdAt: serverTimestamp()
    })
    newMessage.value = ''
    scrollToBottom()
  } catch (error) {
    console.error("Error sending message:", error)
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 100)
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  // Handle Firestore Timestamp or Date object
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
  .chat-window { width: 90%; right: 5%; bottom: 90px; }
}

/* Chat Widget Styles */
.chat-widget {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 2000;
}

.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(45deg, var(--primary), #ff4d88);
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(255, 77, 136, 0.4);
  transition: 0.3s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  font-size: 0.8rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  font-weight: bold;
}

.chat-window {
  position: absolute;
  bottom: 80px;
  left: 0;
  width: 320px;
  height: 450px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid var(--primary);
}

.chat-header {
  background: var(--primary);
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  font-family: 'Dancing Script', cursive;
  font-size: 1.5rem;
  margin: 0;
}

.close-chat {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #fff0f5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.name-setup {
  text-align: center;
  margin-top: 50px;
}

.name-setup input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid var(--primary);
  border-radius: 10px;
  outline: none;
}

.name-setup button {
  padding: 8px 20px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.empty-chat {
  text-align: center;
  color: #888;
  margin-top: 20px;
  font-style: italic;
}

.message-bubble {
  max-width: 80%;
  display: flex;
  flex-direction: column;
}

.my-message {
  align-self: flex-end;
}

.their-message {
  align-self: flex-start;
}

.message-content {
  padding: 10px 15px;
  border-radius: 15px;
  position: relative;
  font-size: 0.95rem;
}

.my-message .message-content {
  background: var(--primary);
  color: #333; /* Text Hitam agar terbaca jelas */
  border-bottom-right-radius: 2px;
  font-weight: 500;
}

.their-message .message-content {
  background: white;
  color: #333; /* Text Hitam */
  border: 1px solid #ffd1dc;
  border-bottom-left-radius: 2px;
  font-weight: 500;
}

.message-sender {
  font-size: 0.7rem;
  font-weight: bold;
  opacity: 0.8;
  display: block;
  margin-bottom: 2px;
}

.message-time {
  font-size: 0.65rem;
  opacity: 0.7;
  display: block;
  text-align: right;
  margin-top: 4px;
}

.chat-input-area {
  padding: 10px;
  background: white;
  border-top: 1px solid #ffd1dc;
  display: flex;
  gap: 10px;
}

.chat-input-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ffd1dc;
  border-radius: 20px;
  outline: none;
}

.chat-input-area input:focus {
  border-color: var(--primary);
}

.chat-input-area button {
  background: var(--primary);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.chat-input-area button:hover {
  transform: scale(1.1);
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
