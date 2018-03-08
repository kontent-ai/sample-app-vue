<template>
    <div class="footer-wrapper">
        <footer role="contentinfo">
            <div class="footer-container">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-lg-4 footer-col">
                            <h3 class="contact-title">{{contactHeader}}</h3>
                            <p>
                                (+1) 617-632-4520<br />
                                <router-link to="mailto:dancinggoat@localhost.local">{{email}}</router-link>
                                <br />
                                <br /> Dancing Goat Ltd<br /> 62 E Lake St Chicago,<br /> {{cityStateZip}}
                            </p>
                        </div>
                        <div class="col-md-4 col-lg-4 footer-col">
                            <h3>{{followUs}}</h3>
                            <router-link class="followus-link" to="https://www.facebook.com/Dancing.Goat" target="_blank">
                            <img alt="Follow us on Facebook" class="" src="/Images/facebook-icon.png" v-bind:title='followUsOnFacebook' />
                            </router-link>
                            <router-link class="followus-link" to="https://twitter.com/DancingGoat78" target="_blank">
                            <img alt="Follow us on Twitter" class="" src="/Images/twitter-icon.png" v-bind:title='followUsOnTwitter' />
                            </router-link>
                        </div>
                        <div class="col-md-4 col-lg-4 footer-col"></div>
                    </div>
                </div>
            </div>
            <div class="container copyright">
                Copyright &copy; 2016 Dancing Goat. {{allRightsReserved}}
            </div>
        </footer>
    </div>
</template>

<script>
    export default {
        name: "Footer",
        data: () => ({
            contactHeader: "Contact",
            email: "dancinggoat@localhost.local",
            cityStateZip: "Illinois 60601, USA",
            followUs: "Follow us",
            followUsOnFacebook: 'Follow us on Facebook',
            followUsOnTwitter: 'Follow us on Twitter',
            allRightsReserved: "All rights reserved."
        })
    }
</script>
