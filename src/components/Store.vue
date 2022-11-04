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
                            <router-link :to="`/${language.toLowerCase()}/store/coffees`">{{$t('Store.coffeesLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="`/${language.toLowerCase()}/store/brewers`">{{$t('Store.brewersLinkTitle')}}</router-link>
                        </li>
                    </ul>
                </div>
            </nav>
            <router-view :language="language"/>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const language = locale.value
</script>

