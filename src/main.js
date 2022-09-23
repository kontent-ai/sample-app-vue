import Vue from 'vue'
import Router from 'vue-router'
import VueScrollTo from 'vue-scrollto'
import VueI18n from 'vue-i18n'
import * as VueGoogleMaps from 'vue2-google-maps'

import App from './App.vue'
import Configuration from './components/Admin/Configuration.vue'
import Home from './components/Home.vue'
import Store from './components/Store.vue'
import CoffeeStore from './components/CoffeeStore.vue'
import BrewerStore from './components/BrewerStore.vue'
import Articles from './components/Articles.vue'
import About from './components/About.vue'
import Cafes from './components/Cafes.vue'
import Coffee from './components/Coffee.vue'
import Brewer from './components/Brewer.vue'
import Contacts from './components/Contacts.vue'
import NewArticle from './components/NewArticle.vue'
import NotFound from './components/NotFound.vue'

import { projectConfigurationPath } from './Utilities/SelectedProject'

import en from './Localization/en-US.json'
import es from './Localization/es-ES.json'

import './index.css';
import './components/Admin/Admin.css';

Vue.config.productionTip = false;
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAVOq4C-rf7JVeHt6ws9vsf-KHIRpueASg',
  }
});
Vue.use(VueI18n);
Vue.use(Router);
Vue.use(VueScrollTo, {
  duration: 1000,
  easing: 'ease-in-out',
});

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: projectConfigurationPath,
      component: Configuration
    },
    {
      path: '/:lang(en-us|es-es)/store',
      component: Store,
      children: [
        {
          path: 'coffees',
          component: CoffeeStore,
        },
        {
          path: 'brewers',
          component: BrewerStore,
        },
        {
          path: '',
          component: CoffeeStore,
        }
      ]
    },
    {
      path: '/:lang(en-us|es-es)/articles',
      component: Articles,
    },
    {
      path: '/:lang(en-us|es-es)/articles/:articleId',
      component: NewArticle,
    },
    {
      path: '/:lang(en-us|es-es)/about',
      component: About,
    },
    {
      path: '/:lang(en-us|es-es)/cafes',
      component: Cafes,
    },
    {
      path: '/:lang(en-us|es-es)/contacts',
      component: Contacts,
    },
    {
      path: '/:lang(en-us|es-es)/coffees/:coffeeSlug',
      component: Coffee,
    },
    {
      path: '/:lang(en-us|es-es)/brewers/:brewerSlug',
      component: Brewer,
    },
    {
      path: '/:lang(en-us|es-es)',
      component: Home,
    },
    {
      path: '/:lang(en-us|es-es)/404',
      component: NotFound,
    },
    {
      path: '/',
      redirect: '/en-us',
    },
    {
      path: '/:lang(en-us|es-es)/*',
      redirect: to => ({ path: `${to.params.lang}/404` })
    },
    {
      path: '*',
      redirect: '/en-us/404'
    }
  ]
});

let i18n = new VueI18n({
  locale: 'en-US',
  messages: {
    'en-US': en,
    'es-ES': es,
  },
});

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
