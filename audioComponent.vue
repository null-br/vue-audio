<template lang="pug">
.audio-wrapper(:class="playerClass")
  .progress-bar(@click="progressClick")
    span.currentTime {{currentTime | format}}/
    span.endTime {{duration | format}}
    span.percent 播放进度{{percent | percent}}
    .bar-inner(ref="progressBar")
      .progress(ref="progress")
      .progress-btn-wrapper(ref="progressBtn",
        @touchstart.prevent="progressTouchStart",
        @touchmove.prevent="progressTouchMove",
        @touchend.prevent="progressTouchEnd")
        .progress-btn
  .icon(@click.stop.prevent="togglePlay", :class="playIconStyle")
  audio(:src="url", ref="audio", @canplay="ready", @error="error", @timeupdate="updateTime", @ended="end")
</template>
<script>
// import Vue from 'vue'
import { prefixStyle } from './util.js'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  name: 'progress-bar',
  created() {
    this.touch = {}
  },
  props: {
    url: {
      type: String,
      default: '//m10.music.126.net/20171227231607/a6a9c2e8237e5e66d78ffad36ef91c33/ymusic/80c6/33f5/6746/727b26cdc9d91748077edb4a540c7fe7.mp3'
    },
    beforePlayer: {
      type: Function,
      required: false,
      default: _ => (console.log('beforePlayer logic here'))
    },
    afterPlayer: {
      type: Function,
      required: false,
      default: _ => (console.log('do something when player end'))
    },
    playerClass: {
      type: Object,
      required: false,
      default: _ => _
    }
  },
  data() {
    return {
      playing: false,
      duration: 0,
      percent: 0,
      currentTime: 0
    }
  },
  methods: {
    ready(e) {
      this.$nextTick(() => {
        this.duration = e.target.duration
        let beforePlayerP = () => {
          return new Promise((resolve, reject) => {
            resolve(this.beforePlayer(this.$refs.audio))
            reject()
          })
        }
        let start = async () => {
          try {
            await beforePlayerP()
          } catch (e) {
            e()
          }
        }
        start()
      })
      console.log('here4')
    },
    error(error) {
      console.log(error)
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
      // let currentTime = this.currentTime | 0
      this.percent = this.currentTime / this.duration
    },
    end() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.pause()
      if (this.playing) {
        this.togglePlay()
      }
      this.afterPlayer()
    },
    togglePlay() {
      this.playing = !this.playing
      const audio = this.$refs.audio
      this.playing ? audio.play() : audio.pause()
    },
    progressClick(e) {
      const react = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - react.left
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd(e) {
      this.touch.initiated = false
      this._triggerPercent()
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      this.percent = this.$refs.progress.clientWidth / barWidth
      console.log(barWidth)
      this.changePercent(this.percent)
    },
    changePercent(percent) {
      this.$refs.audio.currentTime = this.duration * percent
      if (!this.playing) {
        this.togglePlay()
      }
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
    // format(interval) {
    //   interval = interval | 0
    //   const minute = (interval / 60 | 0) > 9 ? interval / 60 | 0 : `0${interval / 60 | 0}`
    //   const second = (interval % 60) > 9 ? interval % 60 : `0${interval % 60}`
    //   return `${minute}:${second}`
    // }
  },
  computed: {
    playIconStyle() {
      return this.playing ? 'icon-pause' : 'icon-playing'
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
    // playing(newPlaying) {
    //   const audio = this.$refs.audio
    //   this.$nextTick(() => {
    //     newPlaying ? audio.play() : audio.pause()
    //   })
    // }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
size(width, height)
  width width
  height height
borderStyle(size, color, radius)
  border size solid color
  border-radius radius
.audio-wrapper
  margin 0 auto
  size(520spx, 110spx)
  borderStyle(1PX, #8b8b8b, 200spx)
  .progress-bar
    width 600spx
    height 30spx
    .bar-inner
      position relative
      width 400spx
      top 25spx
      height 4spx
      left 70spx
      background rgba(0, 0, 0, 0.3)
      .progress
        position absolute
        height 100%
        background #ffcd32
      .progress-btn-wrapper
        position absolute
        left -8spx
        top -13spx
        size(30spx, 30spx)
        .progress-btn
          position relative
          top 3spx
          left 7spx
          box-sizing border-box
          size(25spx, 25spx)
          border 2PX solid #000000
          border-radius 50%
          background-color #fff
  .icon
    float left
    size(50spx, 50spx)
  .icon-playing
    background url('//vipweb.bs2cdn.yy.com/vipinter_42480ab1d53c4646acd0a24a561187b8.png')
    background-size 100%
  .icon-pause
    background url('//vipweb.bs2cdn.yy.com/vipinter_05e6391752d5485285b91efbb903b06b.png')
    background-size 100%
</style>