<template>
  <div class="project-configuration-section kk-container">
    <a href="/" class="logotype-link">
      <img class="logo" v-bind:src="thisKontentLogo" alt="Kontent.ai Logo" />
    </a>
    <header>
      <div>
        <h1 class="headline-large">Sample Site—Configuration</h1>
        <p class="margin-top-xl">
          For your sample app to work, you should have a Kontent.ai project
          containing content. Your app should be then configured with its
          environment ID. You can either get it by signing in using your Kontent.ai
          credentials or by signing up for a trial. Later, it will be converted
          to a free plan.
        </p>
        <SpinnerBox
          v-if="preparingProject"
          message="Waiting for the sample project to become ready..."
        ></SpinnerBox>
      </div>
    </header>
    <section class="margin-top-xl">
      <h2 class="headline-medium">Get a Environment ID</h2>
      <p class="margin-top-l">
        You may wish to either select from existing projects or create a new
        sample project. The app will be configured with its environemt ID.
      </p>
      <form @submit="openKontentProjectSelector">
        <input
          type="submit"
          class="button-secondary margin-top-xl"
          value="Get Environment ID from Kontent"
        />
      </form>
    </section>
    <section class="section-secondary">
      <h2 class="headline-medium">Set A Environment ID Manually</h2>
      <p class="margin-top-l">
        Alternatively, you can configure your app manually by submitting a
        environment ID below.
      </p>
      <div class="project-id-form margin-top-xl">
        <form @submit="handleSetProjectSubmit">
          <div class="project-id-form">
            <input
              id="ProjectGuid"
              name="ProjectGuid"
              placeholder="Environment ID"
              type="text"
              class="project-id-form__input"
              v-model="currentProjectInputValue"
            />
            <span class="field-validation-valid"></span>
            <input
              type="submit"
              class="button-secondary project-id-form__submit-button"
              value="Submit"
            />
          </div>
        </form>
      </div>
    </section>
    <section class="section-secondary-two">
      <h2 class="headline-medium">Use the Shared Project</h2>
      <p class="margin-top-l">
        Alternatively, you may wish to use the shared project (environemt ID "{{
          thisDefaultEnivronmentId
        }}").
      </p>
      <p class="margin-top-l">
        <strong>Note:</strong> You cannot edit content in the shared project.
      </p>
      <input
        type="submit"
        class="button-secondary margin-top-xl"
        value="Use the shared project"
        @click="setNewEnvironmentId(thisDefaultEnivronmentId)"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import Cookies from 'universal-cookie';
import validator from 'validator';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { injectClient } from '@/Utilities/Symbols';

import {createClient, setEnvironmentIdCookie } from '../../Client';
import kontentLogo from '../../Images/Admin/kontent-ai-logo.svg';
import { defaultEnvironmentId, selectedEnvironmentCookieName } from '../../Utilities/SelectedEnvironment'
import SpinnerBox from '../SpinnerBox.vue';

const router = useRouter();

const getWindowCenterPosition = (windowWidth: number, windowHeight: number) => {
  const dualScreenLeft = window.screenLeft
  const dualScreenTop = window.screenTop
  const screenWidth = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : window.screen.width;
  const screenHeight = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : window.screen.height;
  const left = screenWidth / 2 - windowWidth / 2 + dualScreenLeft;
  const top = screenHeight / 2 - windowHeight / 2 + dualScreenTop;
  return { left, top };
};

const currentProjectInputValue = ref('');
const preparingProject = ref(false);
const sampleProjectItemCount = ref(0);
const thisDefaultEnivronmentId = ref(defaultEnvironmentId);
const thisKontentLogo = ref(kontentLogo);
const cookies = new Cookies(document.cookie);
const environmentIdCookie = cookies.get(selectedEnvironmentCookieName);

const client = injectClient();

onMounted(() => {
  currentProjectInputValue.value = environmentIdCookie;
  window.addEventListener('message', receiveMessage, false);
});

onUnmounted(() => {
  window.removeEventListener('message', receiveMessage);
});

const handleSetProjectSubmit = (event: Event) => {
  event.preventDefault();
  const newEnvironmentId = currentProjectInputValue;
  setNewEnvironmentId(newEnvironmentId.value);
};

const getSampleProjectItemCount = () => {
  const client = createClient(thisDefaultEnivronmentId.value);

  client.items()
    .elementsParameter(['id'])
    .depthParameter(0)
    .toPromise()
    .then((response) => {
      sampleProjectItemCount.value = response.data.items.length;
    });
};

const setNewEnvironmentId = (
  newEnvironmentId: string,
  newlyGeneratedProject?: string
) => {
  if (!validator.isUUID(newEnvironmentId)) {
    const message = `Selected project (${newEnvironmentId}) is not a valid GUID`;
    // eslint-disable-next-line
    console.error(message);
    alert(message);
    currentProjectInputValue.value = environmentIdCookie;
    return;
  }

  client.value = createClient(newEnvironmentId);
  setEnvironmentIdCookie(newEnvironmentId);
  if (newlyGeneratedProject) {
    waitUntilProjectAccessible(newEnvironmentId);
    preparingProject.value = true;
    return;
  }
  redirectToHome(newEnvironmentId);
};

const waitUntilProjectAccessible = (newEnvironmentId: string) => {
  setTimeout(() => {
    createClient(newEnvironmentId)
      .items()
      .elementsParameter(['id'])
      .depthParameter(0)
      .toPromise()
      .then((response) => {
        if (response.data.items.length >= sampleProjectItemCount.value) {
          preparingProject.value = false;
          redirectToHome(newEnvironmentId);
        } else {
          waitUntilProjectAccessible(newEnvironmentId);
        }
      });
  }, 2000);
};

const redirectToHome = (newEnvironmentId: string) => {
  const infoMessage =
    newEnvironmentId === thisDefaultEnivronmentId.value
      ? "You've configured your app to with a project ID of a shared Kontent.ai project."
      : `You've configured your app with a project ID "${newEnvironmentId}". You can edit its contents at https://app.kontent.ai/.`;
  router.push(`/?infoMessage=${infoMessage}`);
};

const receiveMessage = (event: MessageEvent) => {
  if (event.origin.toLowerCase() !== 'https://app.kontent.ai') return;

  if (!event.data.projectGuid) {
    return;
  }

  setNewEnvironmentId(event.data.projectGuid, event.data.newlyGeneratedProject);
};

const openKontentProjectSelector = (event: Event) => {
  event.preventDefault();
  const windowWidth = 800;
  const windowHeight = 800;
  const { left, top } = getWindowCenterPosition(windowWidth, windowHeight);

  window.open(
    'https://app.kontent.ai/sample-site-configuration',
    'Kontent.ai',
    `status=no,width=${windowWidth},height=${windowHeight},resizable=yes,left=
    ${left},top=${top},toolbar=no,menubar=no,location=no,directories=no`
  );

  getSampleProjectItemCount();
};
</script>

<style scoped>
body {
  font-family: 'Work Sans', sans-serif;
  display: table;
  width: 100%;
  background-image: linear-gradient(135deg, #f3f4f5, #d3dff3);
}
p {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
</style>
