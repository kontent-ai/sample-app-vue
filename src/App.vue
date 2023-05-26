<template>
  <div v-if="getEnvironmentIdFromEnvironment() === null">Your environmentId given in your environment variables is not a valid GUID.</div>
  <div
    v-else-if="
      route.path.toLowerCase() !== projectConfigurationPath.toLowerCase()
    "
    id="app"
    class="application-content"
  >
    <HeaderVue :changeLang="changeLang" :infoMessageText="infoMessageText" />
    <router-view :key="route.fullPath" :language="language" />
    <FooterVue :language="language" />
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import {createClient, getEnvironmentIdFromCookies, getEnvironmentIdFromEnvironment, initialEnvironmentId } from './Client';
import FooterVue from './components/Footer.vue';
import HeaderVue from './components/Header.vue';
import { type LanguageCode,languageCodes, languageCodesLowerCase } from './Utilities/LanguageCodes'
import {projectConfigurationPath} from './Utilities/SelectedEnvironment';
import { provideClient } from './Utilities/Symbols';

const i18n = useI18n({ useScope: 'global' });
const language = i18n.locale.value;
const router = useRouter();
const route = useRoute();

const infoMessageText = computed<string | undefined>(() => {
  const val = route.query['infoMessage'];

  return typeof val !== 'string' ? undefined : val;
});

provideClient(createClient(initialEnvironmentId));

onBeforeMount(() => {
  if (
    getEnvironmentIdFromEnvironment() === undefined &&
    !getEnvironmentIdFromCookies()
  ) {
    router.push(projectConfigurationPath)
  }
});

const changeLang = (newLanguage: LanguageCode) => {
  if (
    i18n.locale.value === newLanguage ||
    !languageCodes.includes(newLanguage)
  ) {
    return;
  }

  const urlParts = route.path.split('/');
  const currentLanguage = route.path.split('/')[1];

  if (
    languageCodesLowerCase.includes(currentLanguage.toLocaleLowerCase())
  ) {
    urlParts[1] = newLanguage;
  } else {
    urlParts.splice(1, 0, newLanguage);
  }

  router.replace(urlParts.join('/').toLowerCase());
};
</script>
