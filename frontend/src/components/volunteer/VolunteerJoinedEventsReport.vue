<template>
    <div>
        <apexchart type="donut" :options="options" :series="series" />
    </div>

</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
    data: Array
});

const options = ref({});
const series = ref([]);

const renderChart = () => {
    options.value = {
        labels: props.data.map((record) => record._id)
    }
    series.value = props.data.map((record) => record.total);
}

// fill the data later
onMounted(() => {
    if (props.data) {
        renderChart();
    }
})


</script>