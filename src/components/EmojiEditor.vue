<template>
    <Dropdown :transfer="true">
        <a href="javascript:void(0)">
            插入表情
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem :divided="true" v-for="item in emojis" v-bind:key="item.id" v-html="item.content" @click.native="choosed(item.name)"></DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator'
    //@ts-ignore
    import emojis from '../img-url.json'

    @Component({})
    export default class EmojiEditor extends Vue {
        emojis: Array<Object>=[]
        @Prop() chose: any
        mounted() {
            let cnt = 0
            for(let emoji in emojis) {
                cnt++;
                let emojiitem = {
                    id: cnt,
                    name: emoji,
                    content: "<img src=" + '"' + emojis[emoji] + '"' + ' style="width=4px; height=4px;" />'
                }
                this.emojis.push(emojiitem)
            }
        }

        choosed(name: any) {
            (this.chose as any)(name)
        }
    }
</script>