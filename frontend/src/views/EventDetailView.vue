<template>
    <Navbar />
    <main class="container-fluild px-2 overflow-hidden">
        <Breadcrumb secondBreadcrumbItem="Events" secondLink="/event" :thirdBreadcrumbItem="event.eventTitle" />
        <div class="container-fluid">
            <div class="row" v-if="!isLoading">
                <div class="col-md-12 col-lg-6 mb-sm-5 order-sm-2 order-lg-2">
                    <div class="card h-100 w-100 mt-2" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">
                                {{ event.eventTitle }}
                            </h5>
                            <h6 class="card-subtitle mb-2 text-muted fw-bold mb-3">
                                {{ event.organizer }}
                            </h6>
                            <p class="card-text">
                                {{ event.description }}
                            </p>
                            <ul class="list-group mb-5">
                                <li class="list-group-item">Datetime: {{ event.datetime }}</li>
                                <li class="list-group-item">Location: {{ event.location }}</li>
                                <li class="list-group-item">Quota: {{ event.quota }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-lg-6 mb-sm-5 order-sm-1 order-lg-2">
                    <div class="card h-100 w-100 mt-2" style="width: 18rem;">
                        <img :src="event.image" class="card-img-top img-fluid" alt="...">
                        <div class="card-body">
                            <div v-if="!isAdmin">
                                <h5 class="card-title">Become a volunteer!</h5>
                                <p class="card-text mb-5">You time and talent can make a real different in people's life.
                                </p>
                            </div>
                            <div v-else>
                                <o-table :data="volunteersList" :loading="isLoadingVolunteersList" hoverable paginated
                                    :per-page="perPage">
                                    <o-table-column v-slot="props" field="name" label="Volunteer name" width=2 sortable>
                                        {{ props.row.name }}
                                    </o-table-column>
                                    <o-table-column v-slot="props" field="contact" label="Contact" width=2 sortable>
                                        {{ props.row.contact }}
                                    </o-table-column>
                                    <o-table-column v-slot="props" field="action" label="Action" width=2>
                                        <RouterLink class="btn btn-secondary shadow px-5"
                                            :to="`/volunteer/${props.row._id}`">Edit</RouterLink>
                                        <a class="btn btn-danger"
                                            @click="removeVolunteerFromEvent(`${props.row._id}`)">X</a>
                                    </o-table-column>
                                </o-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Spainner v-else />
        </div>
    </main>
</template>
  
<script setup>
import Navbar from '../components/Navbar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import Spainner from '../components/Spainner.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const isLoading = ref(false);

const route = useRoute();
const api = '/api/v1/events';
const eventManageApi = '/api/v1/events/manage';
const volunteersList = ref();

const isAdmin = ref(false);
const isLoadingVolunteersList = ref(false);
const perPage = ref(5);

const event = ref({
    eventTitle: '',
    organizer: '',
    description: '',
    datetime: '',
    quota: '',
    location: '',
    image: '',
    highlight: '',
});

const getEventRecord = async (id) => {
    isLoading.value = true
    let response = await fetch(`${api}/${id}`);
    let result = await response.json();

    if (result.event) {
        event.value = result.event;

        // format the display datetime to readable text
        event.value.datetime = new Date(event.value.datetime);
    }
    isLoading.value = false;
}

// check the user is admin or not
const checkIsAdmin = () => {
    const token = localStorage.getItem('token');

    if (token) {
        const decode = jwtDecode(token);

        if (decode.isAdmin) {
            isAdmin.value = true;
            getVolunteersList();
        }
    }

}

// get the volunteer list of the event 
const getVolunteersList = async () => {
    const token = localStorage.getItem('token');
    const path = `/getVolunteersDetail/${route.params.id}`;
    isLoadingVolunteersList.value = true;

    let response = await fetch(eventManageApi + path, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'GET',
    })

    if (response.ok) {
        response = await response.json();
        volunteersList.value = response;
    }

    isLoadingVolunteersList.value = false;
}

const removeVolunteerFromEvent = async (volunteerId) => {
    const token = localStorage.getItem('token');

    let data = {
        eventId: route.params.id,
        volunteerId: volunteerId
    };

    data = JSON.stringify(data);

    const path = '/removeVolunteer'

    let response = await fetch(eventManageApi + path, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: data
    })

    if (response.ok) {
        let result = await response.json();
        alert(result.message);
        getVolunteersList();
    }

}


onMounted(() => {
    checkIsAdmin();
    if (route.params.id) {
        getEventRecord(route.params.id);
    }
});

</script>