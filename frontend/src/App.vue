<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { radixUniverse, 
  RadixUniverse, 
  RadixIdentityManager, 
  RadixRemoteIdentity } from 'radixdlt'
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'item-list',
  computed: mapState(['identity']),
  created() {
    // bootstrap dell'universe
    radixUniverse.bootstrap(RadixUniverse.LOCALHOST_SINGLENODE)
    // creazione nuova remote identity
    RadixRemoteIdentity.createNew('Radflix', 'Watch movies, the Radix way').then((identity) => {
      // connessione alla rete
      identity.account.openNodeConnection()
      // aggiorna lo stato dell'applicazione
      this.$store.commit('setIdentity', identity)
    })
  },
});
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
