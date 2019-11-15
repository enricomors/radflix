import Vue from 'vue';
import Router from 'vue-router';
import ItemList from './views/ItemList.vue';
import Item from './views/Item.vue';
import ItemAdd from './views/ItemAdd.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Item List',
      component: ItemList,
    },
    {
      path: '/item/:id',
      name: 'Item',
      component: Item,
    },
    {
      path: '/new-item',
      name: 'Item Add',
      component: ItemAdd,
    },
  ],
});
