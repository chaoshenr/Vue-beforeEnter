import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import find from '@/components/find'
import mine from '@/components/mine'
import EventBus from '@/libs/EventBus';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/find',
      name: 'find',
      component: find
    },
    {
      path: '/mine',
      name: 'mine',
      component: mine
    }
  ]
})
console.log(router);
router.beforeEach((to, from, next) => {
  //如：EventBus.$emit('homeBeforeEnter');
  EventBus.$emit(to.name + 'BeforeEnter');
  next()
})
export default router;
