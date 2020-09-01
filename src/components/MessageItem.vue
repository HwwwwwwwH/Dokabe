<template>
    <div class="message-item">
        <p id="name" v-on:click="privicy"> {{ msg.nickname }} </p>
        <p id="content" v-html="content" v-highlight></p>
        <p id="time"> {{ msg.updated }} </p>
        <p id="opts">
            <reply-editor class="reply-editor" v-bind:type="1" str="回复" v-bind:replyId="msg.id"> </reply-editor>
            <span v-if="msg.nickname===nickname"> | </span>
            <reply-editor class="reply-editor" v-if="msg.nickname===nickname" v-bind:type="2" str="编辑" v-bind:textId="msg.id" v-bind:finput="msg.content"> </reply-editor>
            <span v-if="msg.replys.length"> | </span>
            <!-- {{ msg.nickname }} -->
            <span class="watchreply" v-if="displayreplys===0&&msg.replys.length"  v-on:click="watchreply(1)">查看回复</span>
            <span class="watchreply" v-if="displayreplys" v-on:click="watchreply(0)">收起回复</span>
        </p>
        <div id="replys" v-if="displayreplys"> 
            <reply-item v-for="reply in currentreplys" v-bind:key="reply.id" v-bind:msg="reply"> </reply-item>
            <div id="pages">
                <Page :total="replycount" :page-size="pagesize" size="small" @on-change="pagechanged" id="page-selector"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .message-item {        
        position: relative;
        margin: 10px;
        margin-bottom: 5px;
        min-height: 50px;
        border-top: 1px solid rgb(190, 190, 190);
        text-align: left;
    }

    #name {
        margin-bottom: 10px;
    }

    #name:hover {
        cursor: pointer;
    }

    #time {
        text-align: right;
        font-size: 0.8em;
        color: rgb(185, 185, 185);
    }

    .watchreply {
        text-align: right;
    }

    #opts {
        text-align: right;
        font-size: 0.8em;
        color: rgb(185, 185, 185);
    }

    #replyop {
        margin-right: 5px;
        cursor: pointer;
    }

    #opts {
        cursor: pointer;
    }

    .reply-editor {
        display: inline-block;
    }

    #pages {
        display: flex;
    }

    #page-selector {
        margin: auto;
    }
</style>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator'
    import ReplyItem from './ReplyItem.vue'
    import ReplyEditor from './ReplyEditor.vue'
    //@ts-ignore
    import emojis from '../img-url.json'    

    @Component({
        components: {
            'reply-item': ReplyItem,
            'reply-editor': ReplyEditor
        }
    })
    export default class MessageItem extends Vue {
        @Prop(Object) msg: any
        displayreplys: number=0
        replydisplay: Boolean=false
        input: string=''
        pagesize: number=10
        currentpage: number=1
        currentreplys: Array<Object>=[]
        content: string=''

        get replys() {
            return this.msg.replys
        }

        get nickname() {
            return localStorage.getItem('nickname')
        }

        get replycount() {
            return this.msg.replys.length
        }

        loadpage() {
            this.currentreplys = []
            for(let i = 0; i < this.pagesize && i+this.pagesize*(this.currentpage-1) < this.replys.length; i++) {
                this.currentreplys.push(this.replys[i+this.pagesize*(this.currentpage-1)])
            }
        }

        watchreply(ifwatch: any) {
            this.displayreplys = ifwatch
            if(ifwatch) this.loadpage()
        }

        privicy() {
            this.$router.push({
                path: '/user',
                query: {
                    userId: this.msg.userId
                }
            })
        }

        pagechanged(page: number) {
            this.currentpage = page
            this.loadpage()
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
    }
</script>