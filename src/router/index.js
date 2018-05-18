import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import PersistentMini from '@/components/Draft'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import VueResource from 'vue-resource'
import {VueMasonryPlugin} from 'vue-masonry'
import Toasted from 'vue-toasted'
import moment from 'vue-moment'

Vue.use(Router)
Vue.use(VueMaterial)
Vue.use(VueResource)
Vue.use(VueMasonryPlugin)
Vue.use(Toasted)
Vue.use(moment)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/test',
      name: 'PersistentMini',
      component: PersistentMini
    }
  ]
})
