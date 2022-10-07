import Cookies from 'universal-cookie';
import { selectedProjectCookieName, defaultProjectId } from './Utilities/SelectedProject';
import packageInfo from '../package.json';

// Kontent.ai
import { camelCasePropertyNameResolver, DeliveryClient } from '@kontent-ai/delivery-sdk';

const projectId = import.meta.env.VUE_APP_PROJECT_ID || '';
const previewApiKey = import.meta.env.VUE_APP_PREVIEW_API_KEY || '';

const sourceTrackingHeaderName = 'X-KC-SOURCE';

const cookies = new Cookies(document.cookies);
let currentProjectId = projectId || cookies.get(selectedProjectCookieName);
if (currentProjectId) {
  cookies.set(selectedProjectCookieName, currentProjectId, { path: '/' });
} else {
  currentProjectId = defaultProjectId;
}

const isPreview = () => previewApiKey !== '';

let Client = new DeliveryClient({
  projectId: currentProjectId,
  propertyNameResolver: camelCasePropertyNameResolver,
  previewApiKey: previewApiKey,
  globalQueryConfig: {
    usePreviewMode: isPreview()
  },
  globalHeaders: () => [
    {
      header: sourceTrackingHeaderName,
      value: `${packageInfo.name};${packageInfo.version}`,
    },
  ],
});


const resetClient = (newProjectId) => {
  Client = new DeliveryClient({
    projectId: newProjectId,
    propertyNameResolver: camelCasePropertyNameResolver,
    previewApiKey: previewApiKey,
    globalQueryConfig: {
      usePreviewMode: isPreview()
    },
    globalHeaders: () => [
      {
        header: sourceTrackingHeaderName,
        value: `${packageInfo.name};${packageInfo.version}`,
      },
    ],
  });
  const cookies = new Cookies(document.cookies);
  cookies.set(selectedProjectCookieName, newProjectId, { path: '/' });
}

export {
  Client,
  resetClient
};