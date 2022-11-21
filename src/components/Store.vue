<template>
  <div class="container">
    <div class="container product-page-container">
      <nav
        role="navigation"
        class="sub-menu row"
      >
        <div class="store-menu-list row">
          <ul>
            <li>
              <router-link :to="coffeesLink">{{
                $t('Store.coffeesLinkTitle')
              }}</router-link>
            </li>
            <li>
              <router-link :to="brewersLink">{{
                $t('Store.brewersLinkTitle')
              }}</router-link>
            </li>
          </ul>
        </div>
      </nav>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const coffeesLink = computed(
  () => `/${locale.value.toLowerCase()}/store/coffees`
);
const brewersLink = computed(
  () => `/${locale.value.toLowerCase()}/store/brewers`
);
</script>
