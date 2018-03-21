<template>
    <div class="footer-wrapper">
        <footer role="contentinfo">
            <div class="footer-container">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-lg-4 footer-col">
                            <h3 class="contact-title">{{this.t('contact')}}</h3>
                            <p>
                                (+1) 617-632-4520<br />
                                <router-link to="mailto:dancinggoat@localhost.local">{{email}}</router-link>
                                <br />
                                <br /> Dancing Goat Ltd<br /> 62 E Lake St Chicago,<br /> {{this.t('cityStateZip')}}
                            </p>
                        </div>
                        <div class="col-md-4 col-lg-4 footer-col">
                            <h3>{{this.t('followUs')}}</h3>
                            <a class="followus-link" href="https://www.facebook.com/Dancing.Goat" target="_blank">
                            <img alt="Follow us on Facebook" class="" src="/Images/facebook-icon.png" :title="this.t('followUsOnFacebook')" />
                            </a>
                            <a class="followus-link" href="https://twitter.com/DancingGoat78" target="_blank">
                            <img alt="Follow us on Twitter" class="" src="/Images/twitter-icon.png" :title="this.t('followUsOnTwitter')" />
                            </a>
                        </div>
                        <div class="col-md-4 col-lg-4 footer-col"></div>
                    </div>
                </div>
            </div>
            <div class="container copyright">
                Copyright &copy; 2016 Dancing Goat. {{this.t('allRightsReserved')}}
            </div>
        </footer>
    </div>
</template>

<script>
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'

    export default {
        name: "Footer",
        data: () => ({
            email: "dancinggoat@localhost.local",
        }),
        created: function(){
            this.$translate.setLocales({
                'en-US': en.Footer,
                'es-ES': es.Footer,
            })
        }
    }
</script>
