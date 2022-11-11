<template>
    <div class="footer-wrapper">
        <footer role="contentinfo">
            <div class="footer-container">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-lg-4 footer-col">
                            <h3 class="contact-title">{{$t('Footer.contact')}}</h3>
                            <p>
                                (+0) 000-000-0000<br />
                                <a href="mailto:dancinggoat@localhost.local">{{email}}</a>
                                <br />
                                <br /> Dancing Goat Ltd<br /> 62 E Lake St Chicago,<br /> {{$t('Footer.cityStateZip')}}
                            </p>
                        </div>
                        <div class="col-md-4 col-lg-4 footer-col">
                            <h3>{{$t('Footer.followUs')}}</h3>
                            <a 
                                class="followus-link" 
                                href="https://www.facebook.com/Dancing.Goat" 
                                target="_blank"
                            >
                                <img 
                                    alt="Follow us on Facebook" 
                                    class="" 
                                    src="/Images/facebook-icon.png" 
                                    :title="$t('Footer.followUsOnFacebook')"
                                />
                            </a>
                            <a 
                                class="followus-link" 
                                href="https://twitter.com/DancingGoat78" 
                                target="_blank"
                            >
                                <img 
                                    alt="Follow us on Twitter" 
                                    class="" 
                                    src="/Images/twitter-icon.png" 
                                    :title="$t('Footer.followUsOnTwitter')"
                                />
                            </a>
                        </div>
                        <div class="col-md-4 col-lg-4 footer-col"></div>
                    </div>
                </div>
            </div>
            <div class="container copyright">
                Copyright &copy; 2016 Dancing Goat. {{$t('Footer.allRightsReserved')}}
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
  const email ='dancinggoat@localhost.local';
</script>
