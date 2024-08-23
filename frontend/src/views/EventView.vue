<template>
    <Navbar targetActive="events" />
    <main class="container-fluild px-2 overflow-hidden">
        <Modal             
            modalType="Warning"
            modalTitle="Confirm delete event"
            :modalBody=deleteConfirmMsg
            modalBtn="Delete"
            modalAction="DELETE"
            :modalActionUrl=deleteLink
            redirectLink="/event"
        />

        <Breadcrumb v-if="route.name == 'eventEdit'" secondBreadcrumbItem="Events" secondLink="/event"
            thirdBreadcrumbItem="Edit event" actionName="Delete" actionLink="#"
            modalType="Warning"
        />

        <Breadcrumb v-else secondBreadcrumbItem="Events" secondLink="/event" thirdBreadcrumbItem="New event" />

        <EventForm />
    </main>
</template>
  
<script setup>
import Navbar from '../components/Navbar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import EventForm from '../components/event/EventForm.vue';
import Modal from '../components/Modal.vue';

import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';

const route = useRoute();
const router = useRouter();

const deleteLink = ref('');
const deleteConfirmMsg = ref('');

onMounted(() => {
    // check the user is admin or not 
    if (route.name == 'eventNew' || route.name == 'eventEdit') {
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

    if (route.params.id) {
        deleteLink.value = `/api/v1/events/${route.params.id}`;
        deleteConfirmMsg.value = `Are you sure delete the event with id ${route.params.id}`;
    }

})

</script>