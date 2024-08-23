<template>
    <div class="row justify-content-between align-items-center px-3">
        <nav aria-lablel="breadcrumb" class="col-xs-6 col-sm-6 col-md-4 col-lg-4">
            <ol class="breadcrumb bg-light bg-gradient p-3 mt-4 rounded-3 d-flex align-items-center">
                <li class="breadcrumb-item">
                    <RouterLink to="/" class="text-decoration-none">Home</RouterLink>
                </li>
                <li class="breadcrumb-item">
                    <RouterLink v-if="props.thirdBreadcrumbItem" :to="secondLink" class="text-decoration-none"
                        :class="{ 'text-dark': !props.thirdBreadcrumbItem }">
                        {{ props.secondBreadcrumbItem }}
                    </RouterLink>
                    <span v-else>{{ props.secondBreadcrumbItem }}</span>
                </li>
                <li v-if="props.thirdBreadcrumbItem" class="breadcrumb-item text-dark">
                    {{ props.thirdBreadcrumbItem }}
                </li>
            </ol>
        </nav>
        
        <div v-if="props.actionName" class="col-xs-12 col-sm-6 d-inline-flex justify-content-end align-items-center">
            <a  class="btn text-center w-auto px-4"
                :class="[actionColorIsBlue ? 'btn-primary' : 'btn-danger']" 
                :data-bs-toggle="[modalType ? 'modal' : null]" 
                :data-bs-target="[modalType? '#message' : null]"
                :href="actionLink"
            >
                {{ props.actionName }}
            </a>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import Modal from './Modal.vue';

const props = defineProps({
    secondBreadcrumbItem: String,
    secondLink: String,
    thirdBreadcrumbItem: String,
    actionColorIsBlue: Boolean,
    actionName: String,
    actionLink: String,

    modalType: String,
    modalTitle: String,
    modalBody: String,
    modalBtn: String,
    modalAction: String,
    modalActionUrl: String
});

const actionLink = ref();

onMounted(() => {
    actionLink.value = props.actionLink;
    console.log(actionLink.value)
})

</script>