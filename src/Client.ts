// Kontent.ai
import { camelCasePropertyNameResolver, DeliveryClient } from '@kontent-ai/delivery-sdk'
import Cookies from 'universal-cookie';
import validator from 'validator';

import packageInfo from '../package.json';
import { selectedEnvironmentCookieName } from './Utilities/SelectedProject'

const sourceTrackingHeaderName = 'X-KC-SOURCE';

const cookies = new Cookies(document.cookie);

const previewApiKey = import.meta.env.VITE_VUE_APP_PREVIEW_API_KEY || '';

const getEnvironmentIdFromEnvironment = (): string | null | undefined => {
  const environmentIdFromEnv = import.meta.env.VITE_VUE_APP_ENVIRONMENT_ID;

  if (environmentIdFromEnv && !validator.isUUID(environmentIdFromEnv)) {
    console.error(
      `Your environmentId (${environmentIdFromEnv}) given in your environment variables is not a valid GUID.`
    );
    return null;
  }

  return environmentIdFromEnv;
};

const getEnvironmentIdFromCookies = (): string | null => {
  const environmentIdFromCookie = cookies.get(selectedEnvironmentCookieName);

  if (environmentIdFromCookie && !validator.isUUID(environmentIdFromCookie)) {
    console.error(
      `Your environmentId (${environmentIdFromCookie}) from cookies is not a valid GUID.`
    );
    return null;
  }

  return environmentIdFromCookie;
};

const currentEnvironmentId =
  getEnvironmentIdFromEnvironment() ?? getEnvironmentIdFromCookies() ?? '';

const isPreview = () => previewApiKey !== '';

const createClient = (newEnvironmentId: string) => new DeliveryClient({
  environmentId: newEnvironmentId,
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

const Client = createClient(currentEnvironmentId);

const setEnvironmentIdCookie = (newEnvironmentId: string) => {
  const cookies = new Cookies(document.cookie);
  cookies.set(selectedEnvironmentCookieName, newEnvironmentId, { path: '/', sameSite: 'none', secure: true });
}

export { Client, createClient, getEnvironmentIdFromEnvironment, getEnvironmentIdFromCookies, setEnvironmentIdCookie };
