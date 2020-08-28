<template>
    <nav id="nav">
      <ul>
        <li id="logout" v-on:click="logOut">登出</li>
        <li id="user">{{ nickname }}</li>
      </ul>
    <div>
      <img src="../static/logo.png" alt="logo" id="logo"/>
    </div>
    </nav>
</template>

<style scoped>
    #nav {
        position: fixed;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 3em;
        overflow: hidden;
        box-shadow: 2px 2px 3px gray;
    }

    #logo {
        position: absolute;
        top: -12px;
        left: 0;
        height: 150%;
    }

    ul {
        list-style: none;
        display: flex;
        flex-direction: row-reverse;
    }

    #logout {
        margin-left: 5px;
    }

    #logout:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component({})
    export default class Navigator extends Vue {
        @Prop({ default: ''}) nickname!: string
        logOut() {
            let token = localStorage.getItem('jwt')
            let axios = this.$store.state.Axios
            let bbs = this.$store.state.bbs
            let request = {
                headers: {'Authorization': token}
            }
            localStorage.clear()
            axios.patch(bbs + 'api/v1/logout', {},request)
            .then((response: any) => {
            })
            .catch((error: any) => {
            })
            this.$router.push('/login')
        }
    }
</script>