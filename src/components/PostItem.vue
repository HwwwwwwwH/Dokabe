<template>
    <div class="post-item">
        <h3 id="title" v-on:click="toPost" class="enter">{{ info.title }}</h3>
        <p id="author"> 发帖于：{{info.created}}, <span v-on:click="privicy"> {{info.nickname}} </span> </p>
        <p id="content" v-html="content"></p>
        <p class="enter" id="detail" v-on:click="toPost">查看详情>></p>
    </div>
</template>

<style scoped>
    .post-item {
        position: relative;
        margin: 0;
        margin-bottom: 15px;
        padding-top: 25px;
        min-height: 300px;
        border-radius: 5px;
        box-shadow: 2px 1px 2px gray;
    }

    .enter:hover, p span:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    #author {
        text-align: right;
        margin-right: 1rem;
    }

    #content {
        margin: auto 10px;
        margin-top: 10px;
        max-height: 10.4rem;
        overflow: hidden;
    }

    #detail {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 0.7em;
    }
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})

export default class PostItem extends Vue {
    @Prop(Object) info: any
    content: string=''

    get token() {
        return localStorage.getItem('jwt')
    }

    get axios() {
        return this.$store.state.Axios
    }

    get bbs() {
        return this.$store.state.bbs
    }

    imginspect() {
        let str = this.info.content
        let pos = str.indexOf("<img")
        while(pos !== -1) {
            let pr = str.indexOf('>', pos+1)
            str = str.slice(0, pos) + '[图片] <br>' + str.slice(pr+1)
            pos = str.indexOf("<img", pos+10)
        }
        this.content = str
    }

    mounted() {
        this.imginspect()
    }

    toPost() {
        let request = {
            headers: {'Authorization': this.token}
        }
        this.axios.get(this.bbs+'api/v1/post/'+this.info.id, request)
        .then((response: any) => {
            this.$router.push('/post/'+ this.info.id)
        })
    }

    privicy() {
        this.$router.push({
            path: '/user',
            query: {
                userId: this.info.userId
            }
        })
    }
}

</script>