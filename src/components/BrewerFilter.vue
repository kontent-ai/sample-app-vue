<template>
    <aside class="col-md-4 col-lg-3 product-filter">
        <h4>{{$t('BrewerFilter.manufacturerTitle')}}</h4>
        <span
            v-for="manufacturer in manufacturersData"
            class="checkbox js-postback"
            :key="manufacturer.id"
        >
            <input
                :id="manufacturer.id"
                type="checkbox"
                :value="manufacturer.checked"
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
                :value="priceRange.checked"
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
                :value="productStatus.checked"
            />
            <label
                :htmlFor="productStatus.id"
                @click="productStatusOnChange(productStatus.codename)"
            >{{productStatus.name}}</label>
        </span>
    </aside>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const props = defineProps(['productStatuses', 'manufacturers', 'filter']);
const emit = defineEmits(['set-filter']);
const priceRanges = [
  { min: 0, max: 50 },
  { min: 50, max: 250 },
  { min: 250, max: 5000 }
];


const manufacturersData = computed(() => props.manufacturers.map(manufacturer => ({
  codename: manufacturer.codename,
  name: manufacturer.name,
  id: 'Manufacturer-' + manufacturer.codename,
  checked: props.filter.manufacturers.includes(manufacturer.codename)
})));

const priceRangesData = computed(() => priceRanges.map((priceRange, index) => ({
  id: 'PriceRange-' + index,
  checked:
    props.filter.priceRanges.findIndex(
      x => x.min === priceRange.min && x.max === priceRange.max
    ) >= 0,
  formattedPriceRange:
    formatPrice(priceRange.min, locale.value) +
    ' – ' +
    formatPrice(priceRange.max, locale.value),
  rawPriceRange: priceRange
})));

const productStatusesData = computed(() => props.productStatuses.map(productStatus => ({
  id: 'ProductStatus-' + productStatus.codename,
  name: productStatus.name,
  checked: props.filter.productStatuses.includes(productStatus.codename),
  codename: productStatus.codename
})));

const manufacturerOnChange = (codename) => {
  props.filter.toggleManufacturer(codename);
  emit('set-filter', props.filter);
}

const priceRangeOnChange = (priceRange) => {
  props.filter.togglePriceRange(priceRange);
  emit('set-filter', props.filter);
}

const productStatusOnChange = (codename) => {
  props.filter.toggleProductStatus(codename);
  emit('set-filter', props.filter);
}

const formatPrice = (price, language) => 
  price.toLocaleString(language, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }
);

</script>