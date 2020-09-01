<template>
    <div id="editor">
        <div id="post" v-on:click="edit"> {{ str }} </div>
        <Modal v-model="inputdisplay" title="发帖" @on-ok="ok" @on-cancel="cancel" width="1000px">
            <p>标题</p>
            <Input v-model="inputtitle" type="text" :rows="1" placeholder="输入标题" />
            <p>内容</p>
            <editor ref="contenteditor" v-bind:fContent="finput"> </editor>
        </Modal>
    </div>
</template>

<style scoped>

</style>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator'
    import Editor from './Editor.vue'

    @Component({
        components: {
            'editor': Editor
        }
    })
    export default class PostEditor extends Vue {
        @Prop(Number) type!: number
        @Prop(String) str!: string
        @Prop(String) ftitle!: string
        @Prop(String) finput!: string
        inputdisplay: Boolean=false
        inputtitle: string=''

        edit() {
            this.inputdisplay=true
            this.inputtitle = this.ftitle
        }

        ok() {
            let axios = this.$store.state.Axios
            let token = localStorage.getItem('jwt')
            let bbs = this.$store.state.bbs
            let requestData = {
                "title": this.inputtitle,
                "content": (this.$refs.contenteditor as any).editorContent
            }
            let request = {
                headers: {'Authorization': token},
            }
            let Urladdr = bbs+'api/v1/post';
            if(this.type !== 0) {
                Urladdr += '/' + this.$route.path.substring(6)
            }
            if(this.type === 0) {
                axios.post(Urladdr, requestData, request)
                .then((response: any) => {
                    if(this.$route.path !== '/') {
                        this.$router.push('/')
                    } else {
                        location.reload()
                    }
                })  
            }
            else {
                axios.put(Urladdr, requestData, request)
                .then((response: any) => {
                    if(this.$route.path !== '/') {
                        this.$router.push('/')
                    } else {
                        location.reload()
                    }                    
                })
            }
        }

        cancel() {
            this.inputtitle = this.ftitle
        }
    }
</script>