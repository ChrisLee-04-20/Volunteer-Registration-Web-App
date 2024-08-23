<template>
    <div class="container-fluid mt-5 d-flex align-items-center justify-content-center p-5">
        <div class="card bg-light mt-5p-3">
            <div class="card-header fs-2 text-light" :class="[ props.messageType == 'INFO' ? infoStyle : errorStyle, '']">
                {{ props.messageTitle }}
            </div>
            <div class="card-body">
                <p class="card-text mb-5 fs-4">
                    {{ props.messageBody }}
                </p>
                <div class="text-end">
                    <a :href="props.messageRedirectPath" class="btn btn-primary">
                        {{ props.messageRedirectName }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    messageType: String,
    messageTitle: String,
    messageBody: String,
    messageRedirectName: String,
    messageRedirectPath: String, 
});

const infoStyle = ref('bg-primary')
const errorStyle = ref('bg-danger');

</script>