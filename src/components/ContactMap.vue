<template>
    <gmap-map class="map" :style="mapStyle" :center="centerLocation" :zoom="zoom" :clickableIcons="false" >
        <gmap-marker v-for="(location, index) in markerLocations" :position="location" :key="index" />

        <a href="#mapanchor" />
    </gmap-map>

</template>
<!--TODO check map props, scroll-->

<script>
    export default {
        name: "ContactMap",
        props: ['cafesAddresses', 'focusOnAddress'],
        data: () => ({
            mapStyle: {
                position: 'relative',
                width: '100%',
                height: '400px'
            },
            markerLocations: [],
            centerLocation: {lat: 40.854885, lng: -88.081807},
            zoom : 4,
        }),
        watch: {
            cafesAddresses: function(){
                console.log(this.cafesAddresses);
                this.cafesAddresses.map(cafeAddress => {
                        let geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ 'address': cafeAddress }, (results, status) => {
                            if (status === window.google.maps.GeocoderStatus.OK) {
                                let location = results[0].geometry.location;
                                this.pushLocation(location);

                            } else {
                                console.warn('Geocode was not successful for the following reason: ' + status);
                            }
                        })

                });
            },
            focusOnAddress: function(){
                let geocoder = new window.google.maps.Geocoder();
                let cafeAddress = this.focusOnAddress;
                geocoder.geocode({ 'address': cafeAddress }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK) {
                        let location = results[0].geometry.location;
                        this.centerLocation = location;
                        this.zoom = 17;

                    } else {
                        console.warn('Geocode was not successful for the following reason: ' + status);
                    }
                })
            }
        },
        methods: {
            pushLocation(location){
                this.markerLocations.push(location);

            }
        },
    }
</script>