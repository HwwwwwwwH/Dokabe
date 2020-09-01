<template>
    <div>
        <div ref="editor" style="text-align:left"></div>
        <div id="button">
          <!-- <Button type="text" style="margin-right: 2px" v-on:click="emoji"> 插入表情 </Button> -->
          <emoji-editor style="margin-right: 10px" trigger="click" :chose="chose"></emoji-editor>
          <Button type="primary" v-on:click="getContent">查看内容</Button>
        </div>
    </div>
</template>

<style scoped>
  #button {
    text-align: right;
    margin-top: 5px;
    margin-bottom: -5px;
  }
</style>

<script>
    import E from 'wangeditor'
    import EmojiEditor from './EmojiEditor.vue'

    export default {
      name: 'editor',
      data () {
        return {
          editorContent: '',
          editor: null
        }
      },
      props: {
          fContent: {
              default: ''
          }
      },
      components: {
        'emoji-editor': EmojiEditor
      },
      methods: {
        getContent: function () {
          alert(this.editorContent)
        },
        chose: function(name) {
          // let str = editor.txt.html()
          // this.editor.txt.append
          if(this.editorContent !== '') {
            let str = this.editorContent.substring(0, this.editorContent.length-4)
            let lbr = str.indexOf('<br', str.length-5)
            if(lbr !== -1) str = str.substring(0, lbr)
            this.editor.txt.html(str + '[!emoji:' + name + ']' + '</p>')
            this.editorContent = str + '[!emoji:' + name + ']' + '</p>'
          }
          else {
            this.editor.txt.html('<p>' + '[!emoji:' + name + ']' + '</p>')
            this.editorContent = '<p>' + '[!emoji:' + name + ']' + '</p>'
          }
        }
      },
      mounted() {
        this.editor = new E(this.$refs.editor)
        this.editor.customConfig.onchange = (html) => {
          this.editorContent = html
        }
        this.editor.create()
        this.editor.txt.html(this.fContent)
        
      }
    }
</script>

<style scoped>
</style>
