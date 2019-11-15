<template>
    <form>
        <h1 class="title is-1">
            {{form.formName}}
        </h1>
        <div class="field">
            <label class="label">Name</label>
            <div class="control">
                <input class="input" type="text" v-model="form.itemName" />
            </div>
        </div>
        <div class="field">
            <label class="label">Description</label>
            <div class="control">
                <input class="input" type="text" v-model="form.description" />
            </div>
        </div>
        <div class="field">
            <label class="label">Symbol</label>
            <div class="control">
                <input class="input" type="text" v-model="form.symbol" />
            </div>
        </div>
        <div class="field">
            <label class="label">Content url</label>
            <div class="control">
                <input class="input" type="text" v-model="form.contentUrl" />
            </div>
        </div>
        <div class="field">
            <label class="label">Poster url</label>
            <div class="control">
                <input class="input" type="text" v-model="form.posterUrl" />
            </div>
        </div>
        <input class="button is-primary margin-bottom" type="submit" @click.prevent="submit" />
    </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex';
export default Vue.extend({
    name: 'item-add',
    computed: mapState(['identity']),
    data() {
        return {
            form: {
                formName: 'Add a new item',
                itemName: '',
                description: '',
                symbol: '',
                contentUrl: '',
                posterUrl: '',
            },
        }
    },
    methods: {
        submit() {
            // this.$http.post('http://localhost:3001/')
        }
    },  
})
</script>

<style scoped>

</style>