<template>
    <div class="message-item">
        <p id="name" v-on:click="privicy"> {{ msg.nickname }} </p>
        <p id="reply" v-html="content" v-highlight></p>
        <p id="time"> {{ msg.updated }} </p>
        <p class="replyop">
            <reply-editor v-bind:type="1" str="回复" v-bind:replyId="msg.id"> </reply-editor>
            <span v-if="msg.nickname===nickname"> | </span>
            <reply-editor v-if="msg.nickname===nickname" v-bind:type="2" str="编辑" v-bind:textId="msg.id" v-bind:finput="msg.content"> </reply-editor>
        </p>
    </div>
</template>

<style scoped>
    .message-item {        
        margin: 10px;
        margin-bottom: 5px;
        min-height: 50px;
        border-top: 1px solid rgb(190, 190, 190);
        text-align: left;
        font-size: 0.8em;
    }

    #name {
        margin-bottom: 10px;
    }

    #name:hover {
        cursor: pointer;
    }

    #time {
        text-align: right;
        font-size: 0.6em;
        color: rgb(185, 185, 185);
    }

    .replyop {
        text-align: right;
        font-size: 0.8em;
        cursor: pointer;
        color: rgb(185, 185, 185);
    }

    #reply-editor {
        display: inline;
    }
</style>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator'
    import ReplyEditor from './ReplyEditor.vue'
    //@ts-ignore
    import emojis from '../img-url.json'    

    @Component({
        components: {
            'reply-editor': ReplyEditor
        }
    })
    export default class MessageItem extends Vue {
        @Prop(Object) msg: any
        replydisplay: Boolean=false
        input: string=''
        content: string=''

        get nickname() {
            return localStorage.getItem('nickname')
        }

        privicy() {
            this.$router.push({
                path: '/user',
                query: {
                    userId: this.msg.userId
                }
            })
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
            this.content = this.msg.content
            this.imginspect()
            //@ts-ignore
            this.$previewRefresh()
        }

        ok() {
            let token = localStorage.getItem('jwt')
            let axios = this.$store.state.Axios
            let bbs = this.$store.state.bbs
            let requestData = {
                'content': this.input,
                'replyId': this.msg.id
            }
            let request = {
                headers: {'Authorization': token}
            }
            axios.post(bbs+'api/v1/post/' + this.msg.postId +'/reply', requestData, request)
            .then((response: any) => {
                location.reload()
            })
        }

        cancel() {

        }
    }
</script>