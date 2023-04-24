import { DeliveryClient } from "@kontent-ai/delivery-sdk";
import { type InjectionKey, type Ref,inject } from "vue";

export const ClientKey: InjectionKey<Ref<DeliveryClient>> = Symbol('client');

export const injectClient = () => {
  const client = inject(ClientKey);
  if (!client) {
    throw new Error(`Could not resolve ${ClientKey.toString()}`);
  }

  return client;
}
