<!-- <template>
    <gmap-map 
        class="map" 
        :style="mapStyle" 
        :center="centerLocation" 
        :zoom="zoom" 
        id="map" 
        ref="map"
    >
        <gmap-marker 
            v-for="(location, index) in markerLocations" 
            v-if="mapLoaded" 
            :key="index" 
            :position="location"
        />
    </gmap-map>

</template>

<script>
import VueScrollTo from 'vue-scrollto'

export default {
  name: 'ContactMap',
  props: ['cafesAddresses', 'focusOnAddress'],
  data: () => ({
    mapStyle: {
      position: 'relative',
      width: '100%',
      height: '400px'
    },
    markerLocations: [],
    centerLocation: {lat: 40.854885, lng: -88.081807},
    zoom: 4,
    mapLoaded: false,
  }),
  computed: {
    markersLoaded: function(){
      return this.markerLocations.length > 0;
    }
  },
  watch: {
    cafesAddresses: function () {
      this.getMapMarkers();
    },
    mapLoaded: function () {
      this.getMapMarkers();

    },
    focusOnAddress: function () {
      let geocoder = new window.google.maps.Geocoder();
      let cafeAddress = this.focusOnAddress;
      geocoder.geocode({'address': cafeAddress}, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          let location = results[0].geometry.location;
          this.centerLocation = location;
          this.zoom = 17;
          VueScrollTo.scrollTo('#map');
        } else {
          // eslint-disable-next-line no-console
          console.warn('Geocode was not successful for the following reason: ' + status);
        }
      })
    }
  },
  methods: {
    pushLocation(location) {
      this.markerLocations.push(location);
    },
    getMapMarkers() {
      if (!this.mapLoaded || this.markersLoaded) {
        return;
      }
      this.cafesAddresses.map(cafeAddress => {
        let geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({'address': cafeAddress}, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            let location = results[0].geometry.location;
            this.pushLocation(location);
          } else {
            // eslint-disable-next-line no-console
            console.warn('Geocode was not successful for the following reason: ' + status);
          }
        })
      });
    }
  },
  mounted: function () {
    this.map = this.$refs.map.mapObject;
    this.$refs.map.$mapPromise.then(() => {
      this.mapLoaded = true
    })
  },
}
</script> -->