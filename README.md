#### 基于vue的播放器组件
#### 使用方法
```javascript
import player from 'audio/audioComponent'
export default {
  name: 'pkList',
  components: {
    player
  },
  data() {
    return {
      url: '//vipweb.bs2cdn.yy.com/vipinter_1187aeb28eb040b39462e88e24daf13a.mp3'
    }
  },
  methods: {
    init() {},
    beforePlayer(e) {
      // ajax request
      // e.play()
      console.log('beforePlayer')
    },
    afterPlayer() {
      console.log('afterPlayer')
    },
    showRecordList(resolve) {
      resolve('hah')
    },
    updateTime() {},
    end() {},
    error() {}
  },
  computed: {
    playerClass() {
      return ({'page-modal--default': true})
    }
  },
  created() {
    // this.init()
  }
}
// html
player(
    url="//vipweb.bs2cdn.yy.com/vipinter_1187aeb28eb040b39462e88e24daf13a.mp3",
    :beforePlayer="beforePlayer",
    :afterPlayer="afterPlayer",
    :playerClass="playerClass"
  )
```