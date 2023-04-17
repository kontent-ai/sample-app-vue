// Kontent.ai
import { camelCasePropertyNameResolver, DeliveryClient } from '@kontent-ai/delivery-sdk'
import Cookies from 'universal-cookie';
import validator from 'validator';

import packageInfo from '../package.json';
import { selectedProjectCookieName } from './Utilities/SelectedProject'

const sourceTrackingHeaderName = 'X-KC-SOURCE';

const cookies = new Cookies(document.cookie);

const previewApiKey = import.meta.env.VITE_VUE_APP_PREVIEW_API_KEY || '';

const getProjectIdFromEnvironment = (): string | null | undefined => {
  const projectIdFromEnv = import.meta.env.VITE_VUE_APP_PROJECT_ID;

  if (projectIdFromEnv && !validator.isUUID(projectIdFromEnv)) {
    console.error(
      `Your projectId (${projectIdFromEnv}) given in your environment variables is not a valid GUID.`
    );
    return null;
  }

  return projectIdFromEnv;
};

const getProjectIdFromCookies = (): string | null => {
  const projectIdFromCookie = cookies.get(selectedProjectCookieName);

  if (projectIdFromCookie && !validator.isUUID(projectIdFromCookie)) {
    console.error(
      `Your projectId (${projectIdFromCookie}) from cookies is not a valid GUID.`
    );
    return null;
  }

  return projectIdFromCookie;
};

const currentProjectId =
  getProjectIdFromEnvironment() ?? getProjectIdFromCookies() ?? '';

const isPreview = () => previewApiKey !== '';

const Client = new DeliveryClient({
  environmentId: currentProjectId,
  propertyNameResolver: camelCasePropertyNameResolver,
  previewApiKey: previewApiKey,
  defaultQueryConfig: {
    usePreviewMode: isPreview(),
  },
  globalHeaders: () => [
    {
      header: sourceTrackingHeaderName,
      value: `${packageInfo.name};${packageInfo.version}`,
    },
  ],
});

const resetClient = (newProjectId: string) => {
  const newClient = new DeliveryClient({
    environmentId: newProjectId,
    propertyNameResolver: camelCasePropertyNameResolver,
    previewApiKey: previewApiKey,
    defaultQueryConfig: {
      usePreviewMode: isPreview(),
    },
    globalHeaders: () => [
      {
        header: sourceTrackingHeaderName,
        value: `${packageInfo.name};${packageInfo.version}`,
      },
    ],
  });
  const cookies = new Cookies(document.cookie);
  cookies.set(selectedProjectCookieName, newProjectId, { path: '/', sameSite: 'none', secure: true });
  return newClient;
};

export { Client, resetClient, getProjectIdFromEnvironment, getProjectIdFromCookies };
