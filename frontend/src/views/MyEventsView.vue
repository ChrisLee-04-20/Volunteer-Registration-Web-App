<template>
    <Navbar targetActive="myevents" />
    <Breadcrumb secondBreadcrumbItem="My events" secondLink="/myevents" class="ms-2" />
    <main class="container-fluid">
        <div class="row justify-content-around ms-3 overflow-hidden">
            <div class="col-12 col-lg-7 border border-1">
                <VolunteerForm isEdit="true" isVolunteer="true" />
            </div>

            <div class="col-12 col-lg-4 border border-1 mt-5 mt-lg-0">
                <div class="mt-3">
                    <p class="h3">Event Organizers</p>
                </div>
                <VolunteerJoinedEventsReport v-if="eventsOrangizer" :data="eventsOrangizer" />
            </div>
        </div>

        <div class="row mt-2 ms-3">
            <EventCards v-if="volunteerJoinedEvents" :events="displayEvents" />
            <div v-else class="col container text-center">
            </div>
        </div>

        <div v-if="volunteerJoinedEvents">
            <div class="container-fluid overflow-auto mx-3">
                <nav class="mt-4" aria-label="Page navigation example">
                    <ul class="pagination justify-content-sm-start mb-5 overflow-x-auto ">
                        <li v-for="page, index of maximumPage" :key="page" class="page-item d-inline-block"
                            :class="{ active: index + 1 == eventPage }">
                            <button v-if="eventPage == page" class="page-link"
                                @click="changeDisplayEventRecord(page)">{{ page }}</button>
                            <button v-else class="page-link" @click="changeDisplayEventRecord(page)">{{ page }}</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

    </main>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import EventCards from '../components/event/EventCards.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import VolunteerForm from '../components/volunteer/VolunteerForm.vue';
import VolunteerJoinedEventsReport from '../components/volunteer/VolunteerJoinedEventsReport.vue';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';

const router = useRouter();
const eventsOrangizer = ref();
const api = '/api/v1/events/manage';

const volunteerJoinedEvents = ref();
const displayEvents = ref([]);
const maximumPage = ref(1);
const eventPage = ref(1);
const eventPerPage = ref(3);
const isJoinable = ref(null);


const getVolunteerJoinedEvents = async (volunteerId) => {
    const path = `/getVolunteerRecord/${volunteerId}`;
    const token = localStorage.getItem('token');

    let response = await fetch(api + path, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'GET',
    });

    if (response.ok) {
        response = await response.json();
        volunteerJoinedEvents.value = response[0].joinedEvent;
        // set the displaying first 3 events
        const records = volunteerJoinedEvents.value;
        let pages = Math.ceil(records.length / eventPerPage.value);

        maximumPage.value = pages;
        changeDisplayEventRecord(1)
    }

}

// get the data for displaying the chart
const getVolunteerJoinedEventsOrganizer = async (volunteerId) => {
    const path = `/getVolunteerEventsOrganizer/${volunteerId}`;
    const token = localStorage.getItem('token');

    let response = await fetch(api + path, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'GET',
    });

    if (response.ok) {
        response = await response.json();
        eventsOrangizer.value = response;
    }
}

// change the events  
const changeDisplayEventRecord = (page) => {
    if (volunteerJoinedEvents.value) {
        let records = volunteerJoinedEvents.value;
        let result = [];
        let totalRecord = records.length

        if (page == maximumPage.value) {
            let index = (maximumPage.value - 1) * eventPerPage.value;
            for (let i = index; i < totalRecord; i++) {
                result.push(records[i])
            }
            console.log(result)
            eventPage.value = page;
        } else {
            let index = (page - 1) * eventPerPage.value;
            for (let i = index; i < index + 3; i++) {
                result.push(records[i])
            }
            eventPage.value = page;
        }

        displayEvents.value = result;
    }
}

onMounted(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Unauthorised access to this page.Go back to home page.");
        router.push('/');
    }

    const decode = jwtDecode(token);
    const volunteerId = decode._id;

    getVolunteerJoinedEventsOrganizer(volunteerId);
    getVolunteerJoinedEvents(volunteerId);

});

</script>