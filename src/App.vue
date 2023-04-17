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
import {
onBeforeMount,
onMounted,
provide,
ref,
watch
} from 'vue'
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { Client, getProjectIdFromCookies,getProjectIdFromEnvironment } from './Client';
import FooterVue from './components/Footer.vue';
import HeaderVue from './components/Header.vue';
import { languageCodes, languageCodesLowerCase } from './Utilities/LanguageCodes'
import {projectConfigurationPath} from './Utilities/SelectedProject';
import { ClientKey } from './Utilities/Symbols';

const infoMessageText = ref('');

const i18n = useI18n({ useScope: 'global' });
const language = i18n.locale.value;
const router = useRouter();
const route = useRoute();

const client = ref(Client);

provide(ClientKey, client);

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

  i18n.locale.value = newLanguage;

  router.push(urlParts.join('/').toLowerCase());
};

watch(route, (oldValue, newValue) => {
  const newLanguage = newValue.path.split('/')[1];
  if (
    language === newLanguage ||
    !languageCodesLowerCase.includes(newLanguage.toLocaleLowerCase())
  ) {
    return;
  }
  if (languageCodesLowerCase.includes(newLanguage.toLocaleLowerCase())) {
    i18n.locale.value =
      languageCodes[
        languageCodesLowerCase.indexOf(newLanguage.toLocaleLowerCase())
      ];
  }
});

</script>
