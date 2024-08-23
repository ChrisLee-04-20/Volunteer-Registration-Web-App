<template>
    <Navbar targetActive="volunteers" />
    <main class="container-fluild px-2 overflow-hidden">
        <Breadcrumb secondBreadcrumbItem="Volunteers" secondLink="volunteers" actionColorIsBlue="true" actionName="New"
            :actionLink="newVolunteerLink" />

        <section class="px-4">
            <o-table :data="volunteers" :loading="loading" hoverable paginated :per-page="perPage">
                <o-table-column v-slot="props" field="name" label="Volunteer name" width=2 sortable >
                    {{ props.row.name }}
                </o-table-column>
                <o-table-column v-slot="props" field="email" label="Email" width=2 sortable>
                    {{ props.row.email }}
                </o-table-column>
                <o-table-column v-slot="props" field="contact" label="Contact" width=2 sortable>
                    {{ props.row.contact }}
                </o-table-column>
                <o-table-column v-slot="props" field="action" label="Action" width=2>
                    <RouterLink v-if="props.row.name" class="btn btn-secondary shadow px-5" :to="`/volunteer/${props.row._id}`">Edit</RouterLink>
                </o-table-column>
            </o-table>
        </section>
    </main>
</template>
  
<script setup>
import Navbar from '../components/Navbar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();
const loading = ref(false);

const api = '/api/v1/volunteers';
const volunteers = ref();
const total = ref();
const perPage = ref(10);
const newVolunteerLink = ref('/volunteer/new');

const getVolunteers = async () => {
    loading.value = true;
    const token = localStorage.getItem('token');

    let response = await fetch(api, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    response = await response.json();

    if (response.volunteers) {
        console.log(response.volunteers.length);
        volunteers.value = response.volunteers;
    }

    loading.value = false;
}

onMounted(() => {
    // check the user is admin or not 
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

    getVolunteers();
})

</script>