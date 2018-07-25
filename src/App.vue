<template>
    <div v-if="this.$route.path !== '/Admin/Configuration'" id="app" class="application-content">
        <Header :language="language" :changeLang="changeLang"/>
        <router-view :language="language"/>
        <Footer :language="language"/>
    </div>
    <div v-else>
        <router-view/>
    </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Configuration from "./components/Admin/Configuration.vue";
import {
  languageCodes,
  languageCodesLowerCase,
  getLanguageCode
} from "./Utilities/LanguageCodes";

export default {
  name: "app",
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
  },
  methods: {
    changeLang: function(newLanguage) {
      if (
        this.language === newLanguage ||
        languageCodes.indexOf(newLanguage) < 0
      ) {
        return;
      }

      const urlParts = this.$route.path.split("/");
      const currentLanguage = this.$route.path.split("/")[1];
      if (
        languageCodesLowerCase.indexOf(currentLanguage.toLocaleLowerCase()) > -1
      ) {
        urlParts[1] = newLanguage;
      } else {
        urlParts.splice(1, 0, newLanguage);
      }
      this.$router.push(urlParts.join("/"));
      this.$i18n.locale = newLanguage;
    }
  },
  watch: {
    $route: {
      deep: true,
      handler: function() {
        const newLanguage = this.$route.path.split("/")[1];
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
