<template>
  <div class="home">
    <navigator></navigator>
    <div id="posts">
      <post-item v-for="post in posts" v-bind:key="post.id" v-bind:info="post"></post-item>
    </div>
  </div>
</template>

<style scoped>
  #posts {
    margin-top: 100px;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PostItem from '../components/PostItem.vue'
import Navigator from '../components/Navigator.vue'

@Component({
  components: {
    'post-item': PostItem,
    'navigator': Navigator
  }
})

export default class Home extends Vue {
  nickname: string=''
  posts: Array<Object>=[]

  mounted() {
    let token = localStorage.getItem('jwt')
    let axios = this.$store.state.Axios
    let bbs = this.$store.state.bbs
    let request = {
        headers: {'Authorization': token}
    }
    axios.get(bbs+'api/v1/user', request)
    .then((response: any) => {
      this.nickname = response.data.nickname
      let requestData = {
        'page': 1,
        'size': 10,
        'userId': 1,
        'orderByReply': false
      }
      let request = {
        headers: {'Authorization': token},
        params: requestData
      }
      axios.get(bbs+'api/v1/post', request)
      .then((response: any) => {
        console.log(response)
        this.posts = []
        response.data.posts.forEach((post: any) => {
          this.posts.push(post)
          console.log(post)
        });
      })
    }) 
    .catch((error: any) => {
      this.$router.push('/login')
    })
  }
  
}
</script>
