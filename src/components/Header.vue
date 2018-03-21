<template>
    <header class="header" role="banner">
        <div class="menu">
            <div class="container">
                <nav role="navigation">
                    <ul>
                        <li>
                            <router-link :to="homeRoute">{{this.t('homeLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="storeRoute">{{this.t('storeLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="articlesRoute">{{this.t('articlesLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="aboutRoute">{{this.t('aboutLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="cafesRoute">{{this.t('cafesLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="contactsRoute">{{this.t('contactsLinkTitle')}}</router-link>
                        </li>
                    </ul>
                </nav>
                <div class="additional-menu-buttons user-menu">
                    <nav role="navigation">
                        <ul class="dropdown-items-list dropdown-desktop-visible">
                            <li>
                                <a v-on:click="changeLanguage('en-US')">English</a>
                            </li>
                            <li>
                                <a v-on:click="changeLanguage('es-ES')">Español</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <div class="header-row">
            <div class="container">
                <div class="col-xs-8 col-md-8 col-lg-4 logo">
                    <h1 class="logo">
                        <router-link class='logo-link' :to="homeRoute">Dancing Goat</router-link>
                    </h1>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'

    export default {
        name: 'Header',
        props: ['language', 'changeLang'],
        computed: {
            homeRoute: function(){
                return '/' + this.language;
            },
            storeRoute: function(){
                return '/' + this.language + '/' + 'store';
            },
            articlesRoute: function(){
                return '/' + this.language + '/' + 'articles';
            },
            aboutRoute: function(){
                return '/' + this.language + '/' + 'about';
            },
            cafesRoute: function(){
                return '/' + this.language + '/' + 'cafes';
            },
            contactsRoute: function(){
                return '/' + this.language + '/' + 'contacts';
            },
        },
        methods: {
            //TODO exctract
            changeLanguage: function(newLanguage){
                this.changeLang(newLanguage);
            },
        },
        locales: {
            'en-US': en.Header,
            'es-ES': es.Header
        }
    }
</script>
