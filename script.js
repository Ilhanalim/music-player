const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');

const audio = document.getElementById('audio');
const bgArtwork = document.getElementById('bg-artwork');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');
const volumeIcon = document.querySelector('#volume-icon');
const currentVolume = document.querySelector('#volume');

const endpoint = 'https://simple-music-api.000webhostapp.com/api/music';

let playlist;
let songIndex = sessionStorage.getItem('songIndex');
var cacheName = 'audio-cache';

if ('caches' in window) {
  console.log('yes');
}

if (!songIndex) {
  sessionStorage.setItem('songIndex', 0);
}

fetch(endpoint)
  .then((data) => data.json())
  .then((result) => {
    playlist = result.values;
    console.log('playlist: ', playlist);

    let shuffleIsActive = false;

    loadSong(playlist[songIndex]);

    function loadSong(song) {
      audio.src = song.source;
      title.innerText = song.title;
      artist.innerText = song.artist;
      cover.src = song.cover;
      bgArtwork.style.backgroundImage = `url(${song.cover})`;
    }

    function prevSong() {
      if (shuffleIsActive) {
        shuffleSong();
        sessionStorage.setItem('songIndex', songIndex);
      } else {
        songIndex--;
      }

      if (songIndex < 0) {
        songIndex = playlist.length - 1;
      }

      sessionStorage.setItem('songIndex', songIndex);
      loadSong(playlist[songIndex]);

      playSong();
      console.log('song index:', songIndex);
    }

    function nextSong() {
      if (shuffleIsActive) {
        shuffleSong();
        sessionStorage.setItem('songIndex', songIndex);
      } else {
        songIndex++;
      }

      if (songIndex > playlist.length - 1) {
        songIndex = 0;
      }

      sessionStorage.setItem('songIndex', songIndex);

      loadSong(playlist[songIndex]);

      playSong();
      console.log(songIndex);
    }

    function shuffleSong() {
      randomIndex = Math.floor(Math.random() * playlist.length);
      if (songIndex == randomIndex) {
        songIndex++;
      } else {
        songIndex = randomIndex;
      }
      currSongIndex = songIndex;
    }

    function playSong() {
      musicContainer.classList.add('play');
      playBtn.querySelector('i.fas').classList.remove('fa-play');
      playBtn.querySelector('i.fas').classList.add('fa-pause');

      audio.play();
    }

    function pauseSong() {
      musicContainer.classList.remove('play');
      playBtn.querySelector('i.fas').classList.add('fa-play');
      playBtn.querySelector('i.fas').classList.remove('fa-pause');

      audio.pause();
    }

    playBtn.addEventListener('click', () => {
      const isPlaying = musicContainer.classList.contains('play');

      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
      }
    });

    shuffleBtn.addEventListener('click', () => {
      const isActive = shuffleBtn.classList.contains('active');

      if (!isActive) {
        shuffleBtn.classList.add('active');
        shuffleIsActive = true;
      } else {
        shuffleBtn.classList.remove('active');
        shuffleIsActive = false;
      }
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('ended', nextSong);
  })
  .catch((err) => console.log(err));

function randomNumber() {
  let random = [];

  while (random.length < playlist.length) {
    var randomIndex = Math.floor(Math.random() * playlist.length);

    if (random.indexOf(randomIndex) === -1) {
      random.push(randomIndex);
    }
  }

  return random;
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = '0%';
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

function DurTime(e) {
  const { duration, currentTime } = e.srcElement;
  var sec;
  var sec_d;

  let min = currentTime == null ? 0 : Math.floor(currentTime / 60);
  min = min < 10 ? '0' + min : min;

  function get_sec(x) {
    if (Math.floor(x) >= 60) {
      for (var i = 1; i <= 60; i++) {
        if (Math.floor(x) >= 60 * i && Math.floor(x) < 60 * (i + 1)) {
          sec = Math.floor(x) - 60 * i;
          sec = sec < 10 ? '0' + sec : sec;
        }
      }
    } else {
      sec = Math.floor(x);
      sec = sec < 10 ? '0' + sec : sec;
    }
  }

  get_sec(currentTime, sec);

  currTime.innerHTML = min + ':' + sec;

  let min_d = isNaN(duration) === true ? '0' : Math.floor(duration / 60);
  min_d = min_d < 10 ? '0' + min_d : min_d;

  function get_sec_d(x) {
    if (Math.floor(x) >= 60) {
      for (var i = 1; i <= 60; i++) {
        if (Math.floor(x) >= 60 * i && Math.floor(x) < 60 * (i + 1)) {
          sec_d = Math.floor(x) - 60 * i;
          sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
        }
      }
    } else {
      sec_d = isNaN(duration) === true ? '0' : Math.floor(x);
      sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
    }
  }

  get_sec_d(duration);

  durTime.innerHTML = min_d + ':' + sec_d;
}

function changeVolume() {
  audio.volume = 50 / 100;
}

changeVolume();

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('timeupdate', DurTime);
