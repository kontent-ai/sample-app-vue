<template>
    <div 
        v-if="this.$route.path.toLowerCase() !== projectConfigurationPath.toLowerCase()" 
        id="app" 
        class="application-content"
    >
        <Header 
            :language="language" 
            :changeLang="changeLang" 
            :infoMessageText="infoMessageText"
        />
        <router-view :language="language"/>
        <Footer :language="language"/>
    </div>
    <div v-else>
        <router-view/>
    </div>
</template>

<script>
import Cookies from 'universal-cookie';
import qs from 'qs';

import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

import { selectedProjectCookieName, projectConfigurationPath } from './Utilities/SelectedProject';

import {
  languageCodes,
  languageCodesLowerCase,
  getLanguageCode
} from './Utilities/LanguageCodes';

export default {
  name: 'app',
  beforeCreate(){
    const cookies = new Cookies(document.cookie);
    const projectId = cookies.get(selectedProjectCookieName)
    if (!projectId) {
      this.$router.push(projectConfigurationPath);
    }
  },
  data: () => ({
    infoMessageText : '',
    projectConfigurationPath : projectConfigurationPath
  }),
  computed: {
    language: function() {
      return this.$i18n.locale;
    }
  },
  components: {
    Header,
    Footer
  },
  created: function() {
    this.$i18n.locale = getLanguageCode(this.$route.path);
    this.infoMessageText = this.getInfoMessage();
  },
  methods: {
    getInfoMessage: function() {
      return qs.parse(location.search.slice(1)).infoMessage;
    },
    changeLang: function(newLanguage) {
      if (
        this.language === newLanguage ||
        languageCodes.indexOf(newLanguage) < 0
      ) {
        return;
      }

      const urlParts = this.$route.path.split('/');
      const currentLanguage = this.$route.path.split('/')[1];
      if (
        languageCodesLowerCase.indexOf(currentLanguage.toLocaleLowerCase()) > -1
      ) {
        urlParts[1] = newLanguage;
      } else {
        urlParts.splice(1, 0, newLanguage);
      }
      this.$router.push(urlParts.join('/'));
      this.$i18n.locale = newLanguage;
    }
  },
  watch: {
    $route: {
      deep: true,
      handler: function() {
        this.infoMessageText = this.getInfoMessage();
        const newLanguage = this.$route.path.split('/')[1];
        if (
          this.language === newLanguage ||
          languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase()) < 0
        ) {
          return;
        }
        if (
          languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase()) > -1
        ) {
          this.$router.go(this.$route.path);
        }
      }
    }
  }
};
</script>
