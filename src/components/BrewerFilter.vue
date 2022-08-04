<template>
    <aside class="col-md-4 col-lg-3 product-filter">
        <h4>{{$t('BrewerFilter.manufacturerTitle')}}</h4>
        <span
            v-for="manufacturer in manufacturersData"
            class="checkbox js-postback"
            :key="manufacturer.id"
        >
            <input
                v-bind:id="manufacturer.id"
                type="checkbox"
                v-bind:checked="manufacturer.checked"
            />
            <label
                v-bind:htmlFor="manufacturer.id"
                type="checkbox"
                @click="manufacturerOnChange(manufacturer.codename)"
            >{{manufacturer.name}} </label>
        </span>
        <h4>{{$t('BrewerFilter.priceTitle')}}</h4>
        <span
            v-for="priceRange in priceRangesData"
            class="checkbox js-postback"
            :key="priceRange.id"
        >
            <input
                v-bind:id="priceRange.id"
                type="checkbox"
                :checked="priceRange.checked"
            />
            <label
                v-bind:htmlFor="priceRange.id"
                @click="priceRangeOnChange(priceRange.rawPriceRange)"
            >{{priceRange.formattedPriceRange}}</label>
        </span>
        <h4>{{$t('BrewerFilter.statusTitle')}}</h4>
        <span
            v-for="productStatus in productStatusesData"
            class="checkbox js-postback"
            :key="productStatus.id"
        >
            <input
                :id="productStatus.id"
                type="checkbox"
                :checked="productStatus.checked"
            />
            <label
                :htmlFor="productStatus.id"
                @click="productStatusOnChange(productStatus.codename)"
            >{{productStatus.name}}</label>
        </span>
    </aside>
</template>

<script>

export default {
  name: 'BrewerFilter',
  props: ['language', 'manufacturers', 'productStatuses', 'filter'],
  data: () => ({
    priceRanges: [
      { min: 0, max: 50 },
      { min: 50, max: 250 },
      { min: 250, max: 5000 }
    ]
  }),
  computed: {
    manufacturersData: function() {
      return this.manufacturers.map(manufacturer => ({
        codename: manufacturer.codename,
        name: manufacturer.name,
        id: 'Manufacturer-' + manufacturer.codename,
        checked: this.filter.manufacturers.includes(manufacturer.codename)
      }));
    },
    priceRangesData: function() {
      return this.priceRanges.map((priceRange, index) => ({
        id: 'PriceRange-' + index,
        checked:
          this.filter.priceRanges.findIndex(
            x => x.min === priceRange.min && x.max === priceRange.max
          ) >= 0,
        formattedPriceRange:
          this.formatPrice(priceRange.min, this.language) +
          ' – ' +
          this.formatPrice(priceRange.max, this.language),
        rawPriceRange: priceRange
      }));
    },
    productStatusesData: function() {
      return this.productStatuses.map(productStatus => ({
        id: 'ProductStatus-' + productStatus.codename,
        name: productStatus.name,
        checked: this.filter.productStatuses.includes(productStatus.codename),
        codename: productStatus.codename
      }));
    }
  },
  methods: {
    manufacturerOnChange: function(codename) {
      this.filter.toggleManufacturer(codename);
      this.$emit('set-filter', this.filter);
    },
    priceRangeOnChange: function(priceRange) {
      this.filter.togglePriceRange(priceRange);
      this.$emit('set-filter', this.filter);
    },
    productStatusOnChange: function(codename) {
      this.filter.toggleProductStatus(codename);
      this.$emit('set-filter', this.filter);
    },
    formatPrice: function(price, language) {
      return price.toLocaleString(language, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      });
    },
  },
};
</script>