<template>
    <div class="project-configuration-section kk-container">
        <a
            href="/"
            class="logotype-link"
        >
            <img
                class="logo"
                v-bind:src="kontentLogo"
                alt="Kontent.ai Logo"
            />
        </a>
        <header>
            <div>
                <h1 class="headline-large">Sample Site—Configuration</h1>
                <p class="margin-top-xl">For your sample app to work, you should have a Kontent.ai project containing content. Your app should be then configured with its project ID. You can either get it by signing in using your Kontent.ai credentials or by signing up for a trial. Later, it will be converted to a free plan.</p>
                <SpinnerBox
                    v-if="this.preparingProject"
                    message="Waiting for the sample project to become ready..."
                ></SpinnerBox>
            </div>
        </header>
        <section class="margin-top-xl">
            <h2 class="headline-medium">Get a Project ID</h2>
            <p class="margin-top-l">You may wish to either select from existing projects or create a new sample project. The app will be configured with its project ID.</p>
            <form @submit="openKontentProjectSelector">
                <input
                    type="submit"
                    class="button-secondary margin-top-xl"
                    value="Get Project ID from Kontent"
                />
            </form>
        </section>
        <section class="section-secondary">
            <h2 class="headline-medium">Set A Project ID Manually</h2>
            <p class="margin-top-l">Alternatively, you can configure your app manually by submitting a project ID below.</p>
            <div class="project-id-form margin-top-xl">
                <form @submit="handleSetProjectSubmit">
                    <div class="project-id-form">
                        <input
                            id="ProjectGuid"
                            name="ProjectGuid"
                            placeholder="Project ID"
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
            <p class="margin-top-l">Alternatively, you may wish to use the shared project (project ID "{{defaultProjectId}}").</p>
            <p class="margin-top-l">
                <strong>Note:</strong> You cannot edit content in the shared project.
            </p>
            <input
                type="submit"
                class="button-secondary margin-top-xl"
                value="Use the shared project"
                @click="setNewProjectId(defaultProjectId)"
            />
        </section>
    </div>
</template>

<script>
import Cookies from 'universal-cookie';
import { isUUID } from 'validator';
import { Subject } from 'rxjs';

import SpinnerBox from '../SpinnerBox.vue';

import { resetClient, Client } from '../../Client';
import {
  defaultProjectId,
  selectedProjectCookieName
} from '../../Utilities/SelectedProject';

import kontentLogo from '../../Images/Admin/kk-logo.svg';

const getWindowCenterPosition = (windowWidth, windowHeight) => {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;
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

export default {
  name: 'Configuration',
  data: () => ({
    currentProjectInputValue: '',
    preparingProject: false,
    sampleProjectItemCount: 0,
    unsubscribeSubject: new Subject(),
    defaultProjectId: defaultProjectId,
    kontentLogo: kontentLogo,
  }),
  created() {
    this.currentProjectInputValue = this.projectIdCookie;
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage, false);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveMessage);
  },
  methods: {
    handleSetProjectSubmit(event) {
      event.preventDefault();
      const newProjectId = this.currentProjectInputValue;
      this.setNewProjectId(newProjectId);
    },
    unsubscribe() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
      this.unsubscribeSubject = new Subject();
    },
    getSampleProjectItemCount() {
      resetClient(defaultProjectId);

      Client.items()
        .elementsParameter(['id'])
        .depthParameter(0)
        .toPromise()
        .then(response => {
          this.sampleProjectItemCount = response.items.length;
        });
    },
    setNewProjectId(newProjectId, newlyGeneratedProject) {
      if (!isUUID(newProjectId)) {
        const message = `Selected project (${newProjectId}) is not a valid GUID`;
        // eslint-disable-next-line
        console.error(message);
        alert(message);
        this.currentProjectInputValue = this.projectIdCookie;
        return;
      }

      resetClient(newProjectId);
      if (newlyGeneratedProject) {
        this.waitUntilProjectAccessible(newProjectId);
        this.preparingProject = true;
        return;
      }
      this.redirectToHome(newProjectId);
    },
    waitUntilProjectAccessible(newProjectId) {
      setTimeout(() => {
        Client.items()
          .elementsParameter(['id'])
          .depthParameter(0)
          .toPromise()
          .then(response => {
            if (response.items.length >= this.sampleProjectItemCount) {
              this.preparingProject = false;
              this.redirectToHome(newProjectId);
            } else {
              this.waitUntilProjectAccessible(newProjectId);
            }
          });
      }, 2000);
    },
    redirectToHome(newProjectId) {
      const infoMessage =
        newProjectId === defaultProjectId
          ? 'You\'ve configured your app to with a project ID of a shared Kontent.ai project.'
          : `You've configured your app with a project ID "${newProjectId}". You can edit its contents at https://app.kontent.ai/.`;
      const dataOriginInfo = 'Data on this site originates from Kontent.ai as well from static JSON resources. To distinguish data sources see https://github.com/kontent-ai/sample-app-vue#data-origin';
      this.$router.push(`/?infoMessage=${infoMessage}${dataOriginInfo}`);
    },
    receiveMessage(event) {
      if (event.origin.toLowerCase() !== 'https://app.kontent.ai') return;

      if (!event.data.projectGuid) {
        return;
      }

      this.setNewProjectId(
        event.data.projectGuid,
        event.data.newlyGeneratedProject
      );
    },
    openKontentProjectSelector(event) {
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

      this.getSampleProjectItemCount();
    }
  },
  computed: {
    cookies() {
      return new Cookies(document.cookie);
    },
    projectIdCookie() {
      return this.cookies.get(selectedProjectCookieName);
    }
  },
  components: {
    SpinnerBox
  }
};
</script>

<style scoped>
body {
  font-family: 'GT Walsheim Pro', sans-serif;
  display: table;
  width: 100%;
  background-image: linear-gradient(135deg, #F3F4F5, #D3DFF3);
}
p {
  margin: 0;
  font-family: 'GT Walsheim Pro', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
</style>