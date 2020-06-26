<template>
    <div class="project-configuration-section">
        <div class="logotype-row">
            <div class="content">
                <div class="logotype">
                    <a 
                        href="/" 
                        class="logotype-link"
                    >
                        <!-- <img 
                            src={kontentLogo} 
                            alt="Kentico Kontent Logo"
                        /> -->
                        <img v-bind:src="kontentLogo"/>
                    </a>
                </div>
            </div>
        </div>
        <header>
            <div class="content">
                <h1>Sample Site—Configuration</h1>
                <p>For your sample app to work, you should have a Kentico Kontent project containing content. Your app should be then configured with its project ID. You can either get it by signing in using your Kentico Kontent credentials or by signing up for a trial. Later, it will be converted to a free plan.</p>
                <SpinnerBox
                    v-if="this.preparingProject"
                    message="Waiting for the sample project to become ready..."
                ></SpinnerBox>
            </div>
        </header>
        <section>
            <h2>Get a Project ID</h2>
            <p>You may wish to either select from existing projects or create a new sample project. The app will be configured with its project ID.</p>
            <form @submit="openKenticoKontentProjectSelector">
                <input 
                    type="submit" 
                    class="button-secondary" 
                    value="Get Project ID from Kentico Kontent"
                />
            </form>
        </section>
        <div class="content sections-secondary divided">
            <section class="section-secondary">
                <h2>Set A Project ID Manually</h2>
                <p>Alternatively, you can configure your app manually by submitting a project ID below.</p>
                <div class="inline-controls">
                    <form @submit="handleSetProjectSubmit">
                        <div class="form-group">
                            <div class="form-group-label">
                                <label for="ProjectGuid">ProjectGuid</label>
                            </div>
                            <div class="form-group-input">
                                <input
                                    id="ProjectGuid"
                                    name="ProjectGuid"
                                    placeholder="ProjectGuid"
                                    type="text"
                                    v-model="currentProjectInputValue"
                                />
                            </div>
                            <div class="message-validation">
                                <span class="field-validation-valid"></span>
                            </div>
                        </div>
                        <input 
                            type="submit" 
                            class="button-secondary" 
                            value="Submit"
                        />
                    </form>
                </div>
            </section>
            <section class="section-secondary">
                <h2>Use the Shared Project</h2>
                <p>Alternatively, you may wish to use the shared project (project ID "{{defaultProjectId}}").</p>
                <p>
                    <strong>Note:</strong> You cannot edit content in the shared project.
                </p>
                <input
                    type="submit"
                    class="button-secondary"
                    value="Use the shared project"
                    @click="setNewProjectId(defaultProjectId)"
                />
            </section>
        </div>
    </div>
</template>

<script>
import Cookies from 'universal-cookie';
import { isUUID } from 'validator';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import SpinnerBox from '../SpinnerBox.vue';

import { resetClient, Client } from '../../Client';
import { resetStores } from '../../Utilities/StoreManager';
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
        .toObservable()
        .pipe(takeUntil(this.unsubscribeSubject))
        .subscribe(response => {
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
      resetStores();
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
          .toObservable()
          .pipe(takeUntil(this.unsubscribeSubject))
          .subscribe(response => {
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
          ? 'You\'ve configured your app to with a project ID of a shared Kentico Kontent project.'
          : `You've configured your app with a project ID "${newProjectId}". You can edit its contents at https://app.kontent.ai/.`;
      const dataOriginInfo = 'Data on this site originates from Kentico Kontent as well from static JSON resources. To distinguish data sources see https://github.com/Kentico/kontent-sample-app-vue%23%0AData-origin';
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
    openKenticoKontentProjectSelector(event) {
      event.preventDefault();
      const windowWidth = 800;
      const windowHeight = 800;
      const { left, top } = getWindowCenterPosition(windowWidth, windowHeight);

      window.open(
        'https://app.kontent.ai/sample-site-configuration',
        'Kentico Kontent',
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
