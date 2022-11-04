<template>
    <div 
        v-if="this.$route.path.toLowerCase() !== projectConfigurationPath.toLowerCase()" 
        id="app" 
        class="application-content"
    >
        <HeaderVue
            :changeLang="changeLang" 
            :infoMessageText="infoMessageText"
        />
        <router-view :language="language" />
        <FooterVue :language="language"/>
    </div>
    <div v-else>
        <router-view/>
    </div>
</template>

<script setup>
import Cookies from 'universal-cookie';
import qs from 'qs';

import HeaderVue from './components/Header.vue';
import FooterVue from './components/Footer.vue';

import { selectedProjectCookieName, projectConfigurationPath } from './Utilities/SelectedProject';

import {
  languageCodes,
  languageCodesLowerCase,
  getLanguageCode
} from './Utilities/LanguageCodes';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const infoMessageText = ref('');

const i18n = useI18n({useScope: 'global'});
const language = i18n.locale.value
const router = useRouter();
const route = useRoute();

console.log(language);

onBeforeMount(() => {
  const cookies = new Cookies(document.cookie);
    const projectId = cookies.get(selectedProjectCookieName)
    if (!projectId) {
      router.push(projectConfigurationPath);
    }
})
  
onMounted(() => {
  //locale.value = getLanguageCode(path);
  infoMessageText.value = getInfoMessage();
});

const getInfoMessage = () => {
    return qs.parse(location.search.slice(1)).infoMessage;
}

const changeLang = (newLanguage) => {
    if (
      i18n.locale.value === newLanguage ||
      languageCodes.indexOf(newLanguage) < 0
    ) {
      return;
    }

    const urlParts = route.path.split('/');
    const currentLanguage = route.path.split('/')[1];

    if (
      languageCodesLowerCase.indexOf(currentLanguage.toLocaleLowerCase()) > -1
    ) {
      urlParts[1] = newLanguage;
    } else {
      urlParts.splice(1, 0, newLanguage);
    }

    i18n.locale.value = newLanguage;

    router.push(urlParts.join('/').toLowerCase());
  }

watch(route, (oldValue, newValue) => {
  const newLanguage = newValue.path.split('/')[1];
  if (
    language === newLanguage ||
    languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase()) < 0
  ) {
    return;
  }
  if (
    languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase()) > -1
  ) {
    i18n.locale.value = languageCodes[languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase())]
  }
})
  // watch: {
  //   $route: {
  //     deep: true,
  //     handler: function() {
  //       this.infoMessageText = this.getInfoMessage();
  //       const newLanguage = this.$route.path.split('/')[1];
  //       if (
  //         this.language === newLanguage ||
  //         languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase()) < 0
  //       ) {
  //         return;
  //       }
  //       if (
  //         languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase()) > -1
  //       ) {
  //         this.$router.go(this.$route.path);
  //       }
  //     }
  //   }
  // }
</script>
