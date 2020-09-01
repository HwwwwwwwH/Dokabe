<template>
    <nav id="nav">
      <ul>
        <li> 
            <Icon type="ios-contact" class="icon" v-on:click="privicy"/>
            <div id="logout" v-on:click="logOut"> 登出 </div> 
        </li>
        <li>
            <Icon type="ios-star" class="icon" v-on:click="star"/>
            <div id="star" v-on:click="star"> 收藏 </div>
        </li>
        <li>
            <Icon type="ios-clock" class="icon" v-on:click="history"/>
            <div id="history" v-on:click="history"> 历史记录 </div>
        </li>
        <li>
            <Icon type="ios-contact-outline" class="icon" v-on:click="privicy"/>
            <div id="user" v-on:click="privicy"> 个人信息 </div>
        </li>
        <li>
            <post-editor v-bind:type="0" str="发帖"> </post-editor>
        </li>
      </ul>
    <div>
      <img src="../static/logo.png" alt="logo" id="logo" v-on:click="toHome" />
    </div>
    </nav>
</template>

<style scoped>
    #nav {
        background-color: white;
        position: fixed;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 3.5em;
        overflow: hidden;
        box-shadow: 2px 2px 3px gray;
        z-index: 1;
    }

    #logo {
        position: absolute;
        top: -1.2em;
        left: 0;
        height: 150%;
        cursor: pointer;
    }

    ul {
        list-style: none;
        display: flex;
        flex-direction: row-reverse;
        font-size: 1rem;
        margin-top: 1.2em;
    }

    ul li {
        display: flex;
        flex-direction: row;
        margin-right: 20px;
    }

    ul li:hover {
        cursor: pointer;
    }

    ul li div:hover {
        text-decoration: underline;
    }

    .icon {
        margin-right: 5px;
        margin-top: 4px;
    }

    #logout {
        margin-right: 1em;
    }

</style>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    import PostEditor from './PostEditor.vue'

    @Component({
        components: {
            'post-editor': PostEditor
        }
    })
    export default class Navigator extends Vue {
        @Prop({ default: ''}) nickname!: string
        @Prop(Number) userId !: number
        get token() {
            return localStorage.getItem('jwt')
        }

        get axios() {
            return this.$store.state.Axios
        }

        get bbs() {
            return this.$store.state.bbs
        }

        logOut() {
            let request = {
                headers: {'Authorization': this.token}
            }
            localStorage.clear()
            this.axios.patch(this.bbs + 'api/v1/logout', {},request)
            .then((response: any) => {
                this.$router.push('/login')
            })
            .catch((error: any) => {
            })
        }

        toHome() {
            this.$router.push('/')
        }

        privicy() {
            this.$router.push({
                path: '/user',
                query: {
                    userId: this.userId.toString()
                }
            })
        }

        star() {
            this.$router.push({
                path: '/star'
            })
        }

        history() {
            this.$router.push({
                path: '/history'
            })
        }
    }
</script>