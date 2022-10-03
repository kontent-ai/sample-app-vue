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
                            <router-link :to="`/${language.toLowerCase()}/store/coffees`">{{$t('StoreComponent.coffeesLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="`/${language.toLowerCase()}/store/brewers`">{{$t('StoreComponent.brewersLinkTitle')}}</router-link>
                        </li>
                    </ul>
                </div>
            </nav>
            <router-view :language="language"/>
        </div>
    </div>
</template>

<script>
export default {
  name: 'StoreComponent',
  props: ['language'],
}
</script>

