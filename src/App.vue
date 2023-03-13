<template>
  <div v-if="getProjectIdFromEnvironment() === null">Your projectId given in your environment variables is not a valid GUID.</div>
  <div
    v-else-if="
      route.path.toLowerCase() !== projectConfigurationPath.toLowerCase()
    "
    id="app"
    class="application-content"
  >
    <HeaderVue :changeLang="changeLang" :infoMessageText="infoMessageText" />
    <router-view :language="language" />
    <FooterVue :language="language" />
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import qs from 'qs';

import HeaderVue from './components/Header.vue';
import FooterVue from './components/Footer.vue';

import {projectConfigurationPath} from './Utilities/SelectedProject';

import {
  languageCodes,
  languageCodesLowerCase,
} from './Utilities/LanguageCodes';
import { h, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { getProjectIdFromEnvironment, getProjectIdFromCookies } from './Client';

const infoMessageText = ref('');

const i18n = useI18n({ useScope: 'global' });
const language = i18n.locale.value;
const router = useRouter();
const route = useRoute();


onBeforeMount(() => {
  if (
    getProjectIdFromEnvironment() === undefined &&
    !getProjectIdFromCookies()
  ) {
    router.push(projectConfigurationPath)
  }
});

onMounted(() => {
  infoMessageText.value = getInfoMessage();
});

const getInfoMessage = (): string => {
  return qs.parse(location.search.slice(1)).infoMessage as string;
};

const changeLang = (newLanguage: string) => {
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
};

watch(route, (oldValue, newValue) => {
  const newLanguage = newValue.path.split('/')[1];
  if (
    language === newLanguage ||
    languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase()) < 0
  ) {
    return;
  }
  if (languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase()) > -1) {
    i18n.locale.value =
      languageCodes[
        languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase())
      ];
  }
});

</script>
