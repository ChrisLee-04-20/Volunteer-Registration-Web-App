<template>
    <div class="card h-100" v-if="props.event">
        <RouterLink :to="eventDetailLink">
            <img :src="event.image" class="card-img-top ratio ratio-16x9 " alt="...">
        </RouterLink>
        <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">
                {{ event.eventTitle }}
            </h5>
            <p class="card-text">
                {{ (event.description.length) > 300 ? (event.description.substr(0, 300) + ' ...'): event.description }}
            </p>
            <p class="card-text">
                <small class="text-muted">Last updated {{ (eventDatetimeMin > 1440) ? getDay(eventDatetimeMin) + " days ago" : 
                (eventDatetimeMin > 60) ?  getHour(eventDatetimeMin) + " hours ago" : eventDatetimeMin + " mins ago" }}</small>
            </p>
            <div v-if="props.isEditable" class="w-100 d-flex justify-content-end float-end">
                <RouterLink :to="eventEditLink" class="btn btn-primary float-end px-2 py-2 w-25">Edit</RouterLink>
            </div>
            <div v-if="props.isJoinable" class="w-100 d-flex justify-content-end float-end">
                <a @click="joinEvent" class="btn btn-outline-primary float-end px-2 py-2 w-25">Join</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { jwtDecode } from 'jwt-decode';
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const props = defineProps({
    event: Object,
    isEditable: String,
    isJoinable: Boolean
});

let eventDetailLink = ref(`/event/detail/`);
let eventEditLink = ref(`/event/edit/`);
const eventsManageApi = '/api/v1/events/manage';
const router = useRouter();

const event = ref(props.event);
let eventDatetimeMin = ref(null);

const formatISODateToMins = (isoDate) => {
    let current = new Date();
    let inputDate = new Date(isoDate)
    let mins = new Date(current.getTime() - inputDate.getTime()) / 1000 / 60;
    mins = Math.ceil(mins);
    return (mins);
};

const getDay = (mins) => {
    return (Math.ceil(mins / (24 * 60)));
};

const getHour = (mins) => {
    return (Math.round((mins / 60) * 10) / 10);
};

const initEvent = () => {
    eventDatetimeMin.value = formatISODateToMins(props.event.updatedAt);
    eventDetailLink.value = eventDetailLink.value + props.event._id;
    eventEditLink.value = eventEditLink.value + props.event._id;
}

// 2023/11/27 allow the volunteer to join the event
const joinEvent = async () => {
    // get the current user info from the token
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);

    const data = {
        eventId: event.value._id,
        volunteerId: decoded._id
    }

    let response = await fetch(eventsManageApi, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (response.ok) {
        let result = await response.json();
        alert(result.message);
        router.push('/myevents')
    }

}

onMounted(() => {
    initEvent();
});

watch(() => props.event, () => {
    event.value = props.event;
})

</script>