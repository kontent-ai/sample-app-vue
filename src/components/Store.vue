<template>
    <div class="container">
        <div class="container product-page-container">
            <nav role="navigation" class="sub-menu row">
                <div class="store-menu-list row">
                    <ul>
                        <li>
                            <router-link to="/en-us/store/coffees">{{coffeesLinkTitle}}</router-link>
                        </li>
                        <li>
                            <router-link to="/en-us/store/brewers">{{brewersLinkTitle}}</router-link>
                        </li>
                    </ul>
                </div>
            </nav>
            <router-view/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Store",
        data: () => ({
            coffeesLinkTitle: "Coffees",
            brewersLinkTitle: "Brewers",
        })
    }
</script>

