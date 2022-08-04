<template>
    <aside class="col-md-4 col-lg-3 product-filter">
        <h4>{{$t('CoffeeFilter.coffeeProcessingTitle')}}</h4>
        <div
            v-for="processing in processingsData"
            :key="processing.codename"
        >
            <span class="checkbox js-postback">
                <input
                    :id="processing.codename"
                    type="checkbox"
                    :checked="processing.checked"
                />
                <label
                    :htmlFor="processing.codename"
                    @click="processingOnChange(processing.codename)"
                >{{processing.name}}</label>
            </span>
        </div>
        <h4>{{$t('CoffeeFilter.statusTitle')}}</h4>
        <div
            v-for="productStatus in productStatusesData"
            :key="productStatus.codename"
        >
            <span class="checkbox js-postback">
                <input
                    :id="productStatus.codename"
                    type="checkbox"
                    :checked="productStatus.checked"
                />
                <label
                    :htmlFor="productStatus.codename"
                    @click="productStatusOnChange(productStatus.codename)"
                >{{productStatus.name}}</label>
            </span>
        </div>
    </aside>
</template>

<script>

export default {
  name: 'CoffeeFilter',
  props: ['language', 'processings', 'productStatuses', 'filter'],
  computed: {
    processingsData: function() {
      return this.processings.map(processing => ({
        codename: processing.codename,
        name: processing.name,
        checked: this.filter.processings.includes(processing.codename)
      }));
    },
    productStatusesData: function() {
      return this.productStatuses.map(productStatus => ({
        codename: productStatus.codename,
        checked: this.filter.productStatuses.includes(productStatus.codename),
        name: productStatus.name
      }));
    }
  },
  methods: {
    processingOnChange: function(codename) {
      this.filter.toggleProcessing(codename);
      this.$emit('set-filter', this.filter);
    },
    productStatusOnChange: function(codename) {
      this.filter.toggleProductStatus(codename);
      this.$emit('set-filter', this.filter);
    },
  },
};
</script>

