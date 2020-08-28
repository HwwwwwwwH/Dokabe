<template>
    <div class="post-item">
        <h4 id="title" v-on:click="toPost">{{ info.title }}</h4>
        <p>  </p>
    </div>
</template>

<style scoped>
    .post-item {
        margin: 0;
        margin-bottom: 5px;
        min-height: 50px;
        border-radius: 5px;
        box-shadow: 2px 1px 2px gray;
    }

    #title:hover{
        text-decoration: underline;
        cursor: pointer;
    }
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})

export default class PostItem extends Vue {
    @Prop(Object) info: any

    toPost() {
        let token = localStorage.getItem('jwt')
        let axios = this.$store.state.Axios
        let bbs = this.$store.state.bbs
        let request = {
            headers: {'Authorization': token}
        }
        axios.get(bbs+'api/v1/post/'+this.info.id, request)
        .then((response: any) => {
            console.log(response)
        })
    }
}

</script>