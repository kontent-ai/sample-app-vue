<template>
    <div class="container">
        <div class="container product-page-container">
            <nav role="navigation" class="sub-menu row">
                <div class="store-menu-list row">
                    <ul>
                        <li>
                            <router-link :to="`/${language}/store/coffees`">{{this.t('coffeesLinkTitle')}}</router-link>
                        </li>
                        <li>
                            <router-link :to="`/${language}/store/brewers`">{{this.t('brewersLinkTitle')}}</router-link>
                        </li>
                    </ul>
                </div>
            </nav>
            <!--language prop needed?-->
            <router-view :language="language"/>
        </div>
    </div>
</template>

<script>
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'

    export default {
        name: "Store",
        props: ['language'],
        created: function(){
            this.$translate.setLocales({
                'en-US': en.Store,
                'es-ES': es.Store
            })
        }
    }
</script>

