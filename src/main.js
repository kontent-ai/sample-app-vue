import Vue from 'vue'
import Router from 'vue-router'
import VueScrollTo from 'vue-scrollto'
import VueI18n from 'vue-i18n'
import * as VueGoogleMaps from 'vue2-google-maps'

import App from './App.vue'
import ConfigurationComponen from './components/Admin/ConfigurationComponen.vue'
import HomeComponent from './components/HomeComponent.vue'
import StoreComponent from './components/StoreComponent.vue'
import CoffeeStore from './components/CoffeeStore.vue'
import BrewerStore from './components/BrewerStore.vue'
import ArticlesComponent from './components/ArticlesComponent.vue'
import AboutComponent from './components/AboutComponent.vue'
import CafesComponent from './components/CafesComponent.vue'
import CoffeeComponent from './components/CoffeeComponent.vue'
import BrewerComponent from './components/BrewerComponent.vue'
import ContactsComponent from './components/ContactsComponent.vue'
import ArticleComponent from './components/ArticleComponent.vue'
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
      component: ConfigurationComponen
    },
    {
      path: '/:lang(en-us|es-es)/store',
      component: StoreComponent,
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
      component: ArticlesComponent,
    },
    {
      path: '/:lang(en-us|es-es)/articles/:articleId',
      component: ArticleComponent,
    },
    {
      path: '/:lang(en-us|es-es)/about',
      component: AboutComponent,
    },
    {
      path: '/:lang(en-us|es-es)/cafes',
      component: CafesComponent,
    },
    {
      path: '/:lang(en-us|es-es)/contacts',
      component: ContactsComponent,
    },
    {
      path: '/:lang(en-us|es-es)/coffees/:coffeeSlug',
      component: CoffeeComponent,
    },
    {
      path: '/:lang(en-us|es-es)/brewers/:brewerSlug',
      component: BrewerComponent,
    },
    {
      path: '/:lang(en-us|es-es)',
      component: HomeComponent,
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
