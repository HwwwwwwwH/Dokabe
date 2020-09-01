<template>
  <div id="login">
    <h1>This is an login page</h1>
    <form method="get">
        账号：<input type="text" v-model="username"/>
        <br />
        密码：<input type="password" v-model="password" />
        <br />
        <button v-on:click.prevent="submitInfo">Login</button>
    </form>
  </div>
</template>

<style scoped>
    #login {
        position: absolute;
        margin: auto;
        top: 50%;
        left: 50%;
        width: 500px;
        padding: 50px;
        box-shadow: 1px 1px 5px gray;
        transform: translate(-50%, -50%);
    }
    h1 {
        margin-bottom: 10px;
    }
</style>

<script lang="ts">
    import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator'
    
    @Component({})

    export default class Login extends Vue {
        username: string=""
        password: string=""
        submitInfo() {
            let bbs = this.$store.state.bbs;
            let axios = this.$store.state.Axios
            let asyncLocalStorage = this.$store.state.AsyncLocalStorage
            let request = {
                'username': '',
                'password': ''
            }
            request.username = this.username
            request.password = this.password
            axios.patch(bbs+'api/v1/login', request)
            .then((response: any) => {
                asyncLocalStorage.setItem('username', response.data.username)
                asyncLocalStorage.setItem('nickname', response.data.nickname)
                asyncLocalStorage.setItem('jwt', response.data.jwt)
                let request = {
                    headers: {'Authorization': response.data.jwt}
                }
                axios.get(bbs+'api/v1/user', request)
                .then((response: any) =>{
                    asyncLocalStorage.setItem('logId', response.data.id)
                    this.$router.push('/')
                })
            })
            .catch(function(error: any) {
                alert('密码错误')
            }) 
        }
        
        mounted() {
            let token = localStorage.getItem('jwt')
            if(token != null) {
                let axios = this.$store.state.Axios
                let bbs = this.$store.state.bbs
                let request = {
                    headers: {'Authorization': token}
                }
                axios.get(bbs+'api/v1/user', request)
                .then((response: any) => {
                    this.$router.push('/')
                }) 
            }
        }
    }
</script>