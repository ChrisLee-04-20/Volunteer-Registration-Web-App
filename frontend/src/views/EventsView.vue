<template>
    <Navbar targetActive="events" />
    <main class="container-fluild px-2 overflow-hidden">
        <Breadcrumb :secondBreadcrumbItem="secondBreadcrumbItem" :secondLink="secondLink" :actionName="actionName"
            actionColorIsBlue="true" :actionLink="newEventLink" />

        <EventCards v-if="events" 
            :isEditable="isEditable" 
            :isJoinable="isJoinable" 
            :events="events" 
            :joinedEvents="volunteerJoinedEvents"
        />

        <Spainner v-else-if="isLoading" />

        <MessageCard v-if="isNotEventFound" :messageType="messageType" :messageTitle="messageTitle"
            :messageBody="messageBody" :messageRedirectName="messageRedirectName"
            :messageRedirectPath="messageRedirectPath" />

        <div class="container-fluid overflow-auto">
            <nav class="mt-4" aria-label="Page navigation example">
                <ul class="pagination justify-content-sm-start mb-5 overflow-x-auto ">
                    <li v-for="page, index of totalPage" :key="page" class="page-item d-inline-block"
                        :class="{ active: index + 1 == currentPage }">
                        <button v-if="route.params.keywords" class="page-link"
                            @click="searchEvent(route.params.keywords, page)">{{ page }}</button>
                        <button v-else class="page-link" @click="getEvents(page)">{{ page }}</button>
                    </li>
                </ul>
            </nav>
        </div>

    </main>
</template>
  
<script setup>
import Navbar from '../components/Navbar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import EventCards from '../components/event/EventCards.vue';
import Spainner from '../components/Spainner.vue';
import MessageCard from '../components/MessageCard.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const secondBreadcrumbItem = ref('Events');
const secondLink = ref('/event/new');
const actionName = ref('');

const api = '/api/v1/events';
const events = ref(null);
const totalPage = ref(null);
const currentPage = ref(null);
const newEventLink = ref('/event/new');
const pageLinks = ref([]);

const route = useRoute();
const isLoading = ref(false);
const isNotEventFound = ref(false);

// check allow the user to edit the event or join the event
const eventsManageApi = '/api/v1/events/manage';
const isEditable = ref();
const isJoinable = ref(null);
const volunteerJoinedEvents = ref();

// display the response message message
const messageType = ref();
const messageTitle = ref();
const messageBody = ref();
const messageRedirectName = ref();
const messageRedirectPath = ref();

const getEvents = async (targetPage) => {
    events.value = null;
    isLoading.value = true;

    let perPage = 6;
    if (targetPage == undefined || targetPage == null) {
        targetPage = 1;
    }

    let response = await fetch(`${api}?perPage=${perPage}&page=${targetPage}`);

    response = await response.json();

    if (response.events) {
        events.value = response.events;
        totalPage.value = (response.total % perPage == 0) ? response.total / 6 : Math.floor(response.total / perPage + 1);
        currentPage.value = response.page;
    }

    isLoading.value = false;
    window.scrollTo(0, 0);
}

const searchEvent = async (keywords, pageNum) => {
    events.value = null;
    isLoading.value = true;

    let perPage = 6;
    let page = 1;

    if (pageNum) {
        page = pageNum;
    }

    let response = await fetch(`${api}?perPage=${perPage}&page=${page}&keywords=${keywords}`);

    response = await response.json();

    console.log(response.events)

    if (response.events == null || response.events == '') {
        messageType.value = 'INFO';
        messageTitle.value = "Not event is found"
        messageBody.value = `Cannot found the matched event with your keyword ${keywords}.`;
        messageRedirectName.value = "Go back to event page"
        messageRedirectPath.value = "/event";
        isNotEventFound.value = true;
        isLoading.value = false;
        return;
    }

    if (response.events) {
        events.value = response.events;
        totalPage.value = (response.total % perPage == 0) ? response.total / perPage : Math.floor(response.total / perPage + 1);
        currentPage.value = response.page;
        isNotEventFound.value = false;
    }

    isLoading.value = false;
    window.scrollTo(0, 0);
}

const checkIsAdmin = async () => {
    const token = localStorage.getItem('token')
    if (token) {
        const decoded = jwtDecode(token);
        if (decoded) {
            let isAdmin = decoded.isAdmin;

            if (isAdmin) {
                actionName.value = "New";
                isEditable.value = 'true';
            } else {
                await getVolunteerJoinedEvents(decoded._id);
                actionName.value = null;
                isJoinable.value = 'true';
            }
        }
    }
}

const getVolunteerJoinedEvents = async (volunteerId) => {
    const path = `/getVolunteerRecord/${volunteerId}`;
    const token = localStorage.getItem('token');

    let response = await fetch(eventsManageApi + path, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'GET',
    });
    
    if (response.ok) {
        response = await response.json();
        console.log(response[0].joinedEvent)
        volunteerJoinedEvents.value = response[0].joinedEvent;
    }
}

onMounted(async() => {
    await checkIsAdmin();
    // isShowBreadCrumb.value = true;

    if (route.params.keywords) {
        secondBreadcrumbItem.value = 'search';
        searchEvent(route.params.keywords)
        return;
    }

    route.params.page ? getEvents(route.params.page) : getEvents();
});

</script>