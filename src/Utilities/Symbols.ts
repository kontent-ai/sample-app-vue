import { DeliveryClient } from "@kontent-ai/delivery-sdk";
import { type InjectionKey, type Ref,inject } from "vue";

export const ClientKey: InjectionKey<Ref<DeliveryClient>> = Symbol('client');

export const injectStrict = <T>(key: InjectionKey<T>, fallback?: T) => {
    const resolved = inject(key, fallback);
    if (!resolved) {
      throw new Error(`Could not resolve ${key.toString()}`);
    }
    return resolved;
  }