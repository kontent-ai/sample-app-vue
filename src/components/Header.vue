<template>
    <header
        class="header"
        role="banner"
    >
        <div class="menu">
            <div class="container">
                <nav role="navigation">
                    <ul>
                        <li>
                            <router-link :to="homeRoute">{{$t('Header.homeLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="storeRoute">{{$t('Header.storeLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="articlesRoute">{{$t('Header.articlesLinkTitle')}}</router-link>
                        </li>
                        <li >
                            <router-link :to="aboutRoute">{{$t('Header.aboutLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="cafesRoute">{{$t('Header.cafesLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="contactsRoute">{{$t('Header.contactsLinkTitle')}}</router-link>
                        </li>
                    </ul>
                </nav>
                <div class="additional-menu-buttons user-menu">
                    <nav role="navigation">
                        <ul class="dropdown-items-list dropdown-desktop-visible">
                            <li>
                                <a v-on:click="changeLang('en-US')">English</a>
                            </li>
                            <li>
                                <a v-on:click="changeLang('es-ES')">Español</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <MessageBox
            v-if="infoMessageText"
            :message="infoMessageText"
        />
        <div class="header-row">
            <div class="container">
                <div class="col-xs-8 col-md-8 col-lg-4 logo">
                    <h1 class="logo">
                        <router-link
                            class='logo-link'
                            :to="homeRoute"
                        >Dancing Goat</router-link>
                    </h1>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import MessageBox from './MessageBox'

export default {
  name: 'Header',
  props: ['language', 'changeLang', 'infoMessageText'],
  computed: {
    homeRoute: function(){
      return '/' + this.language.toLowerCase();
    },
    storeRoute: function(){
      return '/' + this.language.toLowerCase() + '/' + 'store';
    },
    articlesRoute: function(){
      return '/' + this.language.toLowerCase() + '/' + 'articles';
    },
    aboutRoute: function(){
      return '/' + this.language.toLowerCase() + '/' + 'about';
    },
    cafesRoute: function(){
      return '/' + this.language.toLowerCase() + '/' + 'cafes';
    },
    contactsRoute: function(){
      return '/' + this.language.toLowerCase() + '/' + 'contacts';
    }
  },
  components: {
    MessageBox
  }
}
</script>
