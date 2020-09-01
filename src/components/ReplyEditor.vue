<template>
    <div id="reply-editor">
        <span id="replyop" v-on:click="edit"> {{ str }} </span>
        <Modal v-model="replydisplay" title="回复" @on-ok="ok" @on-cancel="cancel" width="1000px">
            <editor ref="editor" v-bind:fContent="finput"></editor>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator'
    import Editor from './Editor.vue'

    @Component({
        components: {
            'editor': Editor
        }
    })
    export default class RplyEditor extends Vue {
        @Prop(Number) type!: number
        @Prop(String) str!: string
        @Prop(String) finput!: string
        @Prop({default: 0}) replyId!: number
        @Prop(Number) textId!: number
        replydisplay: Boolean=false
        
        edit() {
            this.replydisplay = true
        }

        ok() {
            let requestData = {
                'content': (this.$refs.editor as any).editorContent
            }
            let request = {
                headers: {'Authorization': localStorage.getItem('jwt')}
            }
            if(this.type === 0 || this.type === 1) {
                if(this.type === 1) {
                    (requestData as any).replyId = this.replyId
                }
                this.$store.state.Axios.post(this.$store.state.bbs+'api/v1/post/' + this.$route.params.id +'/reply', requestData, request)
                .then((response: any) => {
                    location.reload()
                })
            }
            else {
                this.$store.state.Axios.put(this.$store.state.bbs+'api/v1/post/' + this.$route.params.id + '/reply/' + this.textId, requestData, request)
                .then((response: any) => {
                    location.reload()
                })
            }
        }

        cancel() {
        }
    }
</script>