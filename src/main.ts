import './index.css';
import './components/Admin/Admin.css';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import About from './components/About.vue';
import Configuration from './components/Admin/Configuration.vue';
import Article from './components/Article.vue';
import Articles from './components/Articles.vue';
import Brewer from './components/Brewer.vue';
import BrewerStore from './components/BrewerStore.vue';
import Cafes from './components/Cafes.vue';
import Coffee from './components/Coffee.vue';
import CoffeeStore from './components/CoffeeStore.vue';
import Contacts from './components/Contacts.vue';
import Home from './components/Home.vue';
import NotFound from './components/NotFound.vue';
import Store from './components/Store.vue';
import en from './Localization/en-US.json';
import es from './Localization/es-ES.json';
import { projectConfigurationPath } from './Utilities/SelectedProject';

// TODO
// Vue.config.productionTip = false;
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: projectConfigurationPath,
      component: Configuration,
    },
    {
      path: '/',
      component: Home,
    },
    {
      path: '/:lang(en-us|es-es)',
      component: Home,
    },
    {
      path: '/?infoMessage=:infoMessage(.*)',
      component: Home,
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
        },
      ],
    },
    {
      path: '/:lang(en-us|es-es)/articles',
      component: Articles,
    },
    {
      path: '/:lang(en-us|es-es)/articles/:articleId',
      component: Article,
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
      path: '/:lang(en-us|es-es)/404',
      component: NotFound,
    },
    {
      path: '/:lang(en-us|es-es)/:pathMatch(.*)*',
      redirect: (to) => ({ path: `${to.params.lang}/404` }),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/en-us/404',
    },
  ],
});

const app = createApp(App);
app.use(router);
const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  allowComposition: true,
  messages: {
    'en-US': en,
    'es-ES': es,
  },
});
app.use(i18n);
app.mount('#app');
