import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import Store from './components/Store.vue'
import CoffeeStore from './components/CoffeeStore.vue'
import BrewerStore from './components/BrewerStore.vue'
import Articles from './components/Articles.vue'
import About from './components/About.vue'
import './index.css';

Vue.config.productionTip = false;
Vue.use(Router);
let router = new Router({
    routes: [
        {
            path: '/:lang',
            component: Home,
        },
        {
            path: '/:lang/store',
            component: Store,
            children: [
                {
                    path: "coffees",
                    component: CoffeeStore,
                },
                {
                    path: "brewers",
                    component: BrewerStore,
                },
                {
                    path: "",
                    component: CoffeeStore,
                }
            ]
        },
        {
            path: "/:lang/articles",
            component: Articles,
        },
        {
            path: '/:lang/about',
            component: About,
        }

    ]
});


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
