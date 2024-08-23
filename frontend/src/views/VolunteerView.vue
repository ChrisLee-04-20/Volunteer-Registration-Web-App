<template>
    <Navbar targetActive="volunteer" />
    <main class="container-fluild px-2 overflow-hidden">
        <Breadcrumb v-if="route.name == 'becomeVolunteer'" secondBreadcrumbItem="Become volunteer!"
            secondLink="/become/volunteer" />
        <Breadcrumb v-else secondBreadcrumbItem="Volunteers" secondLink="/volunteers" thirdBreadcrumbItem="Edit"
            :actionName="actionName" actionLink="#" modalType="Warning" />
        <Modal modalType="Warning" modalTitle="Confirm delete volunteer" :modalBody=modalBody modalBtn="Delete"
            modalAction="DELETE" :modalActionUrl=modalActionUrl redirectLink="/volunteers" />
        <VolunteerForm :isEdit="isEdit" />
    </main>
</template>
  
<script setup>
import Navbar from '../components/Navbar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import VolunteerForm from '../components/volunteer/VolunteerForm.vue';
import Modal from '../components/Modal.vue';

import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';

const route = useRoute();
const router = useRouter();
const actionName = ref('Delete');
const isEdit = ref(route.params.id && route.params.id != 'new');

const modalBody = `Are you sure to delete the volunteer with ${route.params.id} id?`;
const modalActionUrl = `/api/v1/volunteers/${route.params.id}`;

onMounted(() => {
    if (route.name == 'volunteersEdit') {
        isEdit.value = 'true';
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Unauthorised access to this page.Go back to home page.')
            router.push('/');
        }

        const decode = jwtDecode(token);

        if (!decode.isAdmin) {
            alert('Unauthorised access to this page.Go back to home page.')
            router.push('/');
        }
    }
})

</script>