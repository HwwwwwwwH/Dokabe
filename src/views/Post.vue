<template>
  <div class="msg">
    <navigator v-bind:nickname="nickname" v-bind:userId="logId"></navigator>
    <main id="post">
      <h2 id="title"> {{ title }} </h2>
      <div id="info"> 
        <button class="star" id="star" v-if="star" v-on:click="vstar(false)"> 
          <Icon type="ios-star" v-if="star"/>
        </button>
        <button class="star" id="nstar" v-if="!star" v-on:click="vstar(true)"> 
          <Icon type="ios-star-outline" v-if="!star"/>
        </button>
        <span>
          发帖于:  {{ time }}
        </span> 
         | 发布人：
        <span id="author" v-on:click="privicy">
          {{ author }} 
        </span>
         |   
        <span id="only" v-on:click="only">只看楼主</span>
        <span v-if="nickname === author"> | </span>
        <p id="edit" v-if="nickname === author">
          <post-editor class="post-editor" v-bind:type="1" str="编辑" v-bind:ftitle="title" v-bind:finput="content"> </post-editor>
        </p>
      </div>
      <div id="main">
        <p v-if="page===1" id="content" v-html="content" v-highlight></p>
        <p class="replyop">
          <reply-editor v-if="page===1" v-bind:type="0" str="回复"> </reply-editor>
        </p>
        <div id="msgs">
          <message-item v-for="reply in display" v-bind:key="reply.id" v-bind:msg="reply"></message-item>
        </div>
      </div>
      <div id="pages">
        <Page ref="pages" :total="replycount" :page-size="pagesize" show-elevator @on-change="pagechanged" id="page-selector" :current="page"/>
      </div>
    </main>
  </div>
</template>

<style scoped>
  #post {
    position: relative;
    margin-top: 100px;
  }

  #title {
    margin-bottom: 25px;
  }

  #main {
    margin: 0 8%;
    box-shadow: 1px 1px 3px gray;
    border-radius: 5px;
  }

  #info {
    text-align: right;
    margin-right: 120px;
    font-size: 0.85em;
    color: rgb(185, 185, 185);
  }

  .star {
    position: absolute;
    left: 93px;
    top: 43px;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    border: none;
    box-shadow: 1px 1px 2px gray;
    background-color: white;
  }

  #author:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  #content {
    padding: 25px 40px;
    text-align: left;
  }

  .replyop {
    text-align: right;
    font-size: 0.8em;
    cursor: pointer;
    margin-right: 10px;
    color: rgb(185, 185, 185);
  }

  #edit {
    display: inline-block;
    cursor: pointer;
  }

  #edit:hover {
    text-decoration: underline;
  }

  #pages {
    display: flex;
    margin-top: 30px;
  }

  #only:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  #page-selector {
    margin: auto;
  }

</style>


<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import Navigator from '../components/Navigator.vue'
  import MessageItem from '../components/MessageItem.vue'
  import PostEditor from '../components/PostEditor.vue'
  import ReplyEditor from '../components/ReplyEditor.vue'
  //@ts-ignore
  import emojis from '../img-url.json'

  @Component({
    components: {
      'navigator': Navigator,
      'message-item': MessageItem,
      'post-editor': PostEditor,
      'reply-editor': ReplyEditor
    }
  })
  export default class Post extends Vue {
    nickname: null | string=''
    replys: Array<Object>=[]
    display: Array<Object>=[]
    predisplay: Array<Object>=[]
    title: string=''
    content: string=''
    page: number=1
    pagesize: number=20
    replycount: number=0
    postId: number=0
    author: string=''
    time: string=''
    userId: number=0
    replydisplay: Boolean=false
    input: string=''
    ifOnly: Boolean=false
    star: Boolean=false

    get logId() {
      return (Number)(localStorage.getItem('logId'))
    }

    get token() {
      return localStorage.getItem('jwt')
    }

    get axios() {
      return this.$store.state.Axios
    }

    get bbs() {
      return this.$store.state.bbs
    }

    loadcontent() {
      this.page = Number(this.$route.query.page)
      this.ifOnly = (this.$route.query.ifOnly === 'true')
      
      let replys;
      if(this.ifOnly) {
        this.replycount = this.predisplay.length
        replys = this.predisplay
      }
      else {
        this.replycount = this.replys.length
        replys = this.replys
      }
      if(isNaN(this.page)) this.page = 1
      this.display = []
      for(let i = 0; i < this.pagesize && i + (this.page - 1) * this.pagesize < replys.length; i++) {
        this.display.push(replys[i + (this.page - 1) * this.pagesize])
      }
    }

    imginspect() {
        let str = this.content
        let pos = str.indexOf("<img")
        while(pos !== -1) {
            str = str.slice(0, pos+4) + ' preview="0" style="max-height: 300px; cursor: zoom-in"' + str.slice(pos+4)
            pos = str.indexOf("<img", pos+10)
        }
        pos = str.indexOf('[!emoji:')
        while(pos !== -1) {
            let pl = str.indexOf(':', pos+2)
            let pr = str.indexOf(']', pl+1)
            let substr = str.substring(pl+1, pr)
            str = str.substring(0, pos) + '<img src="' + emojis[substr] + '" />' + str.substring(pr+1)
            pos = str.indexOf('[!emoji:', pr)
        }
        pos = str.indexOf('<code')
        while(pos !== -1) {
            let pl = str.indexOf('</code', pos)
            let teststr = str.substring(0, pos+5) + ' style="background-color: aliceblue"' + str.substring(pos+5)
            str = teststr
            pos = str.indexOf('<pre', pl)
        }
        pos = str.indexOf('<pre')
        while(pos !== -1) {
            let pl = str.indexOf('</pre', pos)
            let teststr = str.substring(0, pos+4) + ' style="max-height: 500px; overflow-Y: scroll;"' + str.substring(pos+4)
            str = teststr
            pos = str.indexOf('<pre', pl)
        }
        this.content = str
    }

    mounted() {
      this.nickname = localStorage.getItem('nickname')
      let request = {
          headers: {'Authorization': this.token}
      }
      this.postId = Number(this.$route.params.id)
      let stars = JSON.parse(localStorage.getItem('star') as any)
      if(stars === null) this.star = false
      else if(stars[this.postId] == null) this.star = false
      else this.star = stars[this.postId]
      this.axios.get(this.bbs+'api/v1/post/'+ this.postId, request)
      .then((response: any) => {
        this.replys = []
        this.title = response.data.title
        if(!this.title) this.title = '无标题'
        this.content = response.data.content
        this.imginspect()
        this.author = response.data.nickname
        this.time = response.data.created
        this.userId = response.data.userId
        this.predisplay = []
        let cnt = 0
        let map = new Map()
        response.data.reply.forEach((msg: any) => {
           if(msg.replyId === 0) {
             (msg as any).replys = []
             cnt++;
             this.replys.push(msg)
             map.set(msg.id, cnt-1)
           }
        });
        this.replycount = this.replys.length
        response.data.reply.forEach((msg: any) => {
          if(msg.replyId !== 0) {
            (this.replys[map.get(msg.replyId)] as any).replys.push(msg)
            map.set(msg.id, map.get(msg.replyId))
          }
        })
        this.replys.forEach((msg: any) => {
          if(msg.userId === this.userId) {
            this.predisplay.push(msg)
          }
        })
        this.loadcontent()
      })
      .catch((error: any) => {
        this.$router.push('/login')
      })
    }

    pagechanged(page: number) {
      this.$router.push({
        path: '/post/' + this.postId,
        query: {
          page: page.toString(),
          ifOnly: this.ifOnly.toString()
        }
      })
    }

    @Watch('$route')
    routechange(to: any, from: any) {
      if(to.path.indexOf('post') !== -1 && to.path.indexOf(this.postId.toString()) !== -1) {
        this.loadcontent()
      }
    }

    privicy() {
      this.$router.push({
          path: '/user',
          query: {
              userId: this.userId.toString()
          }
      })
    }

    only() {
      this.page = 1
      if(this.ifOnly) {
        this.ifOnly = false
      }
      else {
        this.ifOnly = true
      }
      this.$router.push({
        path: '/post/' + this.postId,
        query: {
          page: this.page.toString(),
          ifOnly: this.ifOnly.toString()
        }
      })
    }

    vstar(istar: Boolean) {
      this.star = istar
      let stars = JSON.parse(localStorage.getItem('star') as any)
      if(stars === null) stars = {}
      stars[this.postId.toString()] = istar
      this.$store.state.AsyncLocalStorage.setItem('star', JSON.stringify(stars))
    }
  }
</script>