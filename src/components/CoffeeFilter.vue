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
                    :value="processing.checked"
                />
                <label
                    :htmlFor="processing.codename"
                    @click="() => processingOnChange(processing.codename)"
                >{{processing.name}}</label>
            </span>
        </div>
        <h4>{{t('CoffeeFilter.statusTitle')}}</h4>
        <div
            v-for="productStatus in productStatusesData"
            :key="productStatus.codename"
        >
            <span class="checkbox js-postback">
                <input
                    :id="productStatus.codename"
                    type="checkbox"
                    :value="productStatus.checked"
                />
                <label
                    :htmlFor="productStatus.codename"
                    @click="productStatusOnChange(productStatus.codename)"
                >{{productStatus.name}}</label>
            </span>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { Filter } from '@/Utilities/CoffeeFilter';
import type { ITaxonomyTerms } from '@kontent-ai/delivery-sdk';
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';

interface ProcessingData {
  codename: string,
  name: string,
  checked: boolean
};

interface ProductStatuses {
  codename: string,
  name: string,
  checked: boolean
};

const props = defineProps<{
  processings: Array<ITaxonomyTerms>,
  productStatuses: Array<ITaxonomyTerms>,
  filter: Filter
}>();

const emit = defineEmits(['set-filter'])
const { t } = useI18n();

const processingsData = computed<Array<ProcessingData>>(() => props.processings.map(processing => ({
    codename: processing.codename,
    name: processing.name,
    checked: props.filter.processings.includes(processing.codename)
  }))
);

const productStatusesData = computed<Array<ProductStatuses>>(() => props.productStatuses.map(productStatus => ({
    codename: productStatus.codename,
    checked: props.filter.productStatuses.includes(productStatus.codename),
    name: productStatus.name
  })
)
);  

const processingOnChange = (codename: string): void => {
  props.filter.toggleProcessing(codename);
  emit('set-filter', props.filter);
}

const productStatusOnChange = (codename: string): void => {
  props.filter.toggleProductStatus(codename);
  emit('set-filter', props.filter);
}

</script>

