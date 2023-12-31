import { songs } from './store.js'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const musicName = $(".title .music-name")
const cd = $(".cd")
const audio = $("audio")
const playBtn = document.querySelector("#playBtn")
const range = $('input[type="range"]')
const repeatBtn = $("#replay")
const next = $("#next")
const prev = $("#previous")
const randomBtn = $("#random")
const listMusic = $$(".music")
const slideBtn = $("#playlist-slide")
const playList = $(".list-music")
const aboveScreen = $(".above-screen")
const pgup = $(".pgup")


const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    isSlideUp: false,
    
    render: function () {
        const htmls = songs.map((song, index) => {
            return `
                <div class="music ${
                    index == this.currentIndex ? "active-song" : ""
                }" data-index=${index}>
                    <div class="content-box">
                         <img src="${song.image}" alt="" class="cd-min">
                         <div class="content">
                             <span class="music-name">${song.name}</span>
                             <span class="singer-name">${song.singer}</span>
                         </div>
                    </div>
                    <div class="options">
                        <i class="fa-solid fa-ellipsis"></i>
                        <div class="delete">Delete</div>
                    </div>
                </div>
            `
        })
        $(".list-music").innerHTML = htmls.join("")
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return songs[this.currentIndex]
            },
        })
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth
        const _this = this

        // CD rotate
        const cdAnimate = cd.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity,
        })
        cdAnimate.pause()

        // Xử lí phóng to/ thu nhỏ

        slideBtn.onclick = function () {
            if (slideBtn.classList.toggle("rotate")) {
                cd.style.width = "160px"
                cd.style.height = "160px"
                cd.style.opacity = "1"
                playList.style.marginTop = 320 - 73 * _this.currentIndex + "px"
                _this.isSlideUp = false
            } else {
                cd.style.width = 0
                cd.style.height = 0
                cd.style.opacity = 0
                playList.style.marginTop = 160 - 73 * _this.currentIndex + "px"
                _this.isSlideUp = true
            }
        }

        // Xử lí play/ pause
        let isPlaying = false

        playBtn.onclick = function () {
            if (isPlaying == false) {
                audio.play()
            } else {
                audio.pause()
            }
        }
        audio.onplay = function () {
            playBtn.className = "fa-regular fa-circle-pause"
            cdAnimate.play()
            _this.render()
            isPlaying = true
            if (_this.isSlideUp) {
                playList.style.marginTop = 160 - 73 * _this.currentIndex + "px"
            } else {
                playList.style.marginTop = 320 - 73 * _this.currentIndex + "px"
            }
        }
        audio.onpause = function () {
            playBtn.className = "fa-regular fa-circle-play"
            cdAnimate.pause()
            isPlaying = false
        }

        // Xử lí thay đổi tiến độ
        audio.ontimeupdate = function () {
            const progress = (audio.currentTime / audio.duration) * 100
            range.value = progress
        }

        // Xử lí khi tua
        range.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lí khi next/prev
        next.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        prev.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }

        // Xử lí random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active")
        }

        // Xử lí khi ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                next.click()
            }
        }

        // Xử lí repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active")
        }

        // Xử lí pgup button
        pgup.onclick = function () {
            if (_this.isSlideUp) {
                playList.style.marginTop = "160px"
            } else {
                playList.style.marginTop = "300px"
            }
        }

        // Xử lí khi click song
        playList.onclick = (e) => {
            const songNode = e.target.closest(".music:not(.active-song)")
            if (songNode) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }

        
    },

    loadCurrentSong: function () {
        musicName.innerText = this.currentSong.name
        cd.src = this.currentSong.image
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * songs.length)
        } while (this.currentIndex === newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    },
}
app.start()

/**
 * Render songs => OK
 * Scroll top => OK
 * Play pause seek => OK
 * CD rotate => OK
 * next prev => OK
 * Random => OK
 * next / Repeat when ended => OK
 * active song => OK
 * Scroll active song into view
 * play song when click
 */
