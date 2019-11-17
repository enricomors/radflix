<template>
  <div class="home">
    <h1 class="title">Welcome to ...</h1>
    <center>    
      <table class="table is-responsive">
        <thead>
          <tr>
            <th width="200"></th>
            <th width="300">Title</th>
            <th>Description</th>
            <th width="50"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.tokenUri">
            <td><img :src="item.posterUrl"></td>
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td v-if="item.tokenUri in myItems">
              <router-link :to="{name: 'Item', params: {id: item.tokenUri}}">
                <button class="button">See</button>
              </router-link>
            </td>
            <td v-else>
              <button @click="buy(item.tokenUri)" class="button">Buy</button>
              <div class="is-size-7"><router-link :to="{name: 'Item', params: {id: item.tokenUri}}">Try watching</router-link></div>
            </td>
          </tr>
        </tbody>
      </table>
    </center>      
  </div>  
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import Decimal from 'decimal.js';

export default Vue.extend({
  data() {
    return {
      items: [],
      myItems: {} as {[tokenUri: string]: string},

      tokenSubscription: null,
    }
  },
  name: 'item-list',
  computed: mapState(['identity']),
  created() {
    this.updateSubscription()
  },
  watch: {
    identity(newValue, oldValue) {
      this.updateSubscription()
    }
  },
  mounted() {
    // this.loadAllItems()
  },
  methods: {
    loadAllItems() {
      this.$http.get('http://localhost:3001/movies').then((response) => {
        this.items = response.body
      })
    },
    updateSubscription() {
      if(this.tokenSubscription) {
        this.tokenSubscription.unsubscribe()
      }
      if(this.identity) {
        this.tokenSubscription = this.identity.account.transferSystem
        .getTokenUnitsBalanceUpdates().subscribe((balance: {[tokenUri: string]: Decimal}) => {
          this.myItems = {}
          for (const tokenUri in balance) {
            if (balance[tokenUri].greaterThan(0)) {
              this.myItems[tokenUri] = tokenUri
            }
          }
        })
      }
    },
    buy(tokenUri: string) {
      this.$http.post('http://localhost:3001/admin/buy-movie',{
        tokenUri,
        address: this.identity.address.toString(),
      }).then((response) => {
        console.log(response)
      })
    }
  }
});
</script>
