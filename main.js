  // --- Animated Name Logic ---
  const profileName = document.querySelector('.profile-name');
  const texts = ["I'm Ziolexy", "Im a Developer", "and a Designer"];
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100; // Speed of typing
  const deleteSpeed = 50; // Speed of deleting
  const pauseTime = 2000; // Time to pause before switching
  
  function typeEffect() {
    const currentText = texts[currentIndex];
    
    if (isDeleting) {
      // Remove char
      profileName.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add char
      profileName.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let currentSpeed = isDeleting ? deleteSpeed : typeSpeed;
    
    // Check if word is complete
    if (!isDeleting && charIndex === currentText.length) {
      // Pause at end
      currentSpeed = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Move to next word
      isDeleting = false;
      currentIndex = (currentIndex + 1) % texts.length;
      currentSpeed = typeSpeed; // Start typing next word quickly
    }
    
    setTimeout(typeEffect, currentSpeed);
  }
  
  // Start the animation after the overlay is clicked
  document.getElementById('start-overlay').addEventListener('click', () => {
    // Delay the start of the animation slightly to ensure the element is visible
    setTimeout(() => {
      typeEffect();
    }, 500); // Adjust delay if needed
  });
  
  // --- Audio Player Logic with Playlist ---
  const songs = [
    { title: "Song 1 - Montagem Contigo", src: "https://files.catbox.moe/r3m5ru.mp3", duration: "1:49" },
    { title: "Song 2 - conscience - Family Business", src: "https://files.catbox.moe/xz98dw.mp3", duration: "3:03" },
    { title: "Song 4 - Able Heart - Magnet ", src: "https://files.catbox.moe/5t7495.mp3", duration: "1:58" },
    { title: "Song 5 - Arthur Nery - Take all the love ", src: "https://files.catbox.moe/mdwa1h.mp3", duration: "4:27" },
    { title: "Song 6 - Shouldnt be", src: "https://files.catbox.moe/zep6lb.mp3", duration: "3:31" }
  ];
  
  let currentSongIndex = 0;
  let hasInteracted = false;
  const audio = new Audio();
  const songTitleBar = document.getElementById('song-title-bar');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const errorMessage = document.getElementById('error-message');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeDisplay = document.getElementById('current-time');
  const totalTimeDisplay = document.getElementById('total-time');
  
  // --- New Playlist Elements ---
  const playlist = document.getElementById('playlist');
  const playlistToggle = document.getElementById('playlist-toggle');
  const playlistContainer = document.getElementById('playlist');
  
  // Format time helper
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  // Update progress bar and time displays
  function updateProgress() {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${percent}%`;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
  }
  
  // Set audio time based on progress bar click
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  }
  
  // Update play/pause icon
  function updatePlayPauseIcon() {
    if (audio.paused) {
      playPauseIcon.classList.remove('fa-pause');
      playPauseIcon.classList.add('fa-play');
      playPauseBtn.title = "Play";
    } else {
      playPauseIcon.classList.remove('fa-play');
      playPauseIcon.classList.add('fa-pause');
      playPauseBtn.title = "Pause";
    }
  }
  
  // --- Playlist Functions ---
  function createPlaylist() {
    playlist.innerHTML = ''; // Clear existing items
    songs.forEach((song, index) => {
      const item = document.createElement('div');
      item.className = 'playlist-item';
      if (index === currentSongIndex) {
        item.classList.add('active');
      }
      item.innerHTML = `
                <span class="playlist-item-number">${index + 1}.</span>
                <span class="playlist-item-title">${song.title}</span>
                <span class="playlist-item-duration">${song.duration}</span>
            `;
      item.addEventListener('click', () => {
        selectSong(index);
      });
      playlist.appendChild(item);
    });
  }
  
  function selectSong(index) {
    if (index >= 0 && index < songs.length) {
      currentSongIndex = index;
      playSong();
      createPlaylist(); // Refresh playlist to show active song
    }
  }
  
  // Play the current song
  function playSong() {
    audio.src = songs[currentSongIndex].src;
    const displayTitle = songs[currentSongIndex].title;
    songTitleBar.textContent = displayTitle;
    errorMessage.classList.add('hidden');
    
    // Reset progress
    progressBar.style.width = '0%';
    currentTimeDisplay.textContent = '0:00';
    totalTimeDisplay.textContent = songs[currentSongIndex].duration || '0:00';
    
    audio.play().then(() => {
      // Update total time once metadata is loaded
      audio.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audio.duration);
        updatePlayPauseIcon();
      }, { once: true });
    }).catch(error => {
      console.error("Audio playback failed:", error);
      errorMessage.classList.remove('hidden');
      errorMessage.textContent = "Error: Unable to play audio.";
      updatePlayPauseIcon();
    });
  }
  
  // Play next song
  function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong();
    createPlaylist(); // Refresh playlist
  }
  
  // Play previous song
  function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong();
    createPlaylist(); // Refresh playlist
  }
  
  // Toggle play/pause
  function togglePlayPause() {
    if (!hasInteracted) {
      hasInteracted = true;
      playSong();
      return;
    }
    
    if (audio.paused) {
      audio.play().catch(error => {
        console.error("Audio playback failed:", error);
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = "Error: Unable to resume audio.";
      });
    } else {
      audio.pause();
    }
    updatePlayPauseIcon();
  }
  
  // Event Listeners
  playPauseBtn.addEventListener('click', togglePlayPause);
  prevBtn.addEventListener('click', playPreviousSong);
  nextBtn.addEventListener('click', playNextSong);
  progressContainer.addEventListener('click', setProgress);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('play', updatePlayPauseIcon);
  audio.addEventListener('pause', updatePlayPauseIcon);
  audio.addEventListener('ended', playNextSong);
  
  // --- Playlist Toggle ---
  playlistToggle.addEventListener('click', () => {
    playlist.classList.toggle('visible');
    const icon = playlistToggle.querySelector('i');
    if (playlist.classList.contains('visible')) {
      icon.classList.remove('fa-list');
      icon.classList.add('fa-times');
      playlistToggle.innerHTML = '<i class="fas fa-times"></i> Close';
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-list');
      playlistToggle.innerHTML = '<i class="fas fa-list"></i> Playlist';
    }
  });
  
  // --- Overlay and UI Logic ---
  const startOverlay = document.getElementById('start-overlay');
  const audioPlayerBar = document.getElementById('audio-player-bar');
  const mainContent = document.getElementById('main-content');
  
  startOverlay.addEventListener('click', () => {
    if (!hasInteracted) {
      hasInteracted = true;
      startOverlay.classList.add('hidden');
      mainContent.classList.add('visible');
      audioPlayerBar.classList.add('visible');
      
      // Initialize playlist
      createPlaylist();
      
      // Start playing after UI transitions
      setTimeout(() => {
        playSong();
      }, 300);
    }
  });
  
  // --- Social Link Confirmation Popup Logic ---
  const socialLinks = document.querySelectorAll('.social-link');
  const confirmationPopup = document.getElementById('confirmation-popup');
  const confirmationMessage = document.getElementById('confirmation-message');
  const confirmYesBtn = document.getElementById('confirm-yes');
  const confirmNoBtn = document.getElementById('confirm-no');
  let pendingUrl = null;
  
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('data-url') || link.href;
      if (url && url !== '#' && url.trim() !== '') {
        pendingUrl = url;
        try {
          confirmationMessage.textContent = `Do you want to visit ${new URL(url).hostname}?`;
        } catch (err) {
          confirmationMessage.textContent = `Do you want to visit the link?`;
        }
        confirmationPopup.classList.add('visible');
      }
    });
  });
  
  confirmYesBtn.addEventListener('click', () => {
    if (pendingUrl) {
      window.open(pendingUrl, '_blank');
      pendingUrl = null;
    }
    confirmationPopup.classList.remove('visible');
  });
  
  confirmNoBtn.addEventListener('click', () => {
    pendingUrl = null;
    confirmationPopup.classList.remove('visible');
  });
  
  confirmationPopup.addEventListener('click', (e) => {
    if (e.target === confirmationPopup) {
      pendingUrl = null;
      confirmationPopup.classList.remove('visible');
    }
  });
