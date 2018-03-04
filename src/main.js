import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import './index.css';

Vue.config.productionTip = false;
Vue.use(Router);
let router = new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: App,
        }
    ]
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
