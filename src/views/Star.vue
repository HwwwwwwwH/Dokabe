<template>
  <div class="home">
    <navigator v-bind:nickname="nickname" v-bind:userId="logId"></navigator>
    <div id="main">
      <div id="posts">
        <post-item v-for="post in posts" v-bind:key="post.id" v-bind:info="post"></post-item>
      </div>
      <div id="pages">
        <Page :total="total" :page-size="postsCount" show-elevator @on-change="pagechanged" id="page-selector"/>
      </div>
    </div>  
  </div>
</template>

<style scoped>
  #main {
    margin-top: 100px;
  }
  #pages {
    display: flex;
    margin-top: 30px;
  }
  #page-selector {
    margin: auto;
  }
  #posts {
    margin: 0 8%;
    margin-top: 100px;
  }
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PostItem from '../components/PostItem.vue'
import Navigator from '../components/Navigator.vue'
import router from '../router'

@Component({
  components: {
    'post-item': PostItem,
    'navigator': Navigator
  }
})

export default class Home extends Vue {
    nickname: string=''
    posts: Array<Object>=[]
    total: number=0
    postsCount: number=10
    page: number=1

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

    getinfo(postId: any) {
        let request = {
            headers: {'Authorization': this.token}
        };
        (async () => {
            const response = await this.axios.get(this.bbs+'api/v1/post/'+postId, request)
            this.posts.push(response.data)
        })()
        
    }

    loadpage() {
        this.page = Number(this.$route.query.page)
        this.posts = []
        if(isNaN(this.page)) this.page = 1
        let userId: any = this.$route.query.userId
        if(userId === null) userId = localStorage.getItem('logId')
        let starpoststring = localStorage.getItem('star')
        if(starpoststring !== null) {
            let starPost: any = JSON.parse(starpoststring)
            let postsId = []
            for(let key in starPost) {
                // if(starPost[key]) this.getinfo(key)
                if(starPost[key]) postsId.push(key)
            }
            this.total = postsId.length
            for(let i = 0; i < this.postsCount && i + (this.page - 1) * this.postsCount < postsId.length; i++) {
                this.getinfo(postsId[i + (this.page - 1) * this.postsCount])
            }
        }
    }

    mounted() {
        let request = {
            headers: {'Authorization': this.token}
        }
        this.axios.get(this.bbs+'api/v1/user', request)
        .then((response: any) => {
            this.nickname = response.data.nickname
            this.loadpage()
        }) 
        .catch((error: any) => {
            this.$router.push('/login')
        })
    }
  
    pagechanged(page: number) {
        this.$router.push({
        path: '/star',
        query: {
            page: page.toString()
        }
        })
    }
  
    @Watch('$route')
    routechange(to: any, from: any) {
        this.loadpage()
    }
}
</script>
