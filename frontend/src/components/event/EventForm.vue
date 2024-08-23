<template>
    <div class="container-fluid px-4 mt-4">
        <form class="row d-flex justify-content-center w-100" @submit.prevent="sumbitEventForm" v-if="!isLoading & !isSubmited">
            <div class="mb-2 col-lg-6">
                <div class="mb-2">
                    <label for="InputEventTitle" class="form-label">Event title</label>
                    <input name="eventTitle" type="text" class="form-control" id="eventTitle" v-model="event.eventTitle" required>
                </div>
                <div class="mb-2">
                    <label for="InputOrganizer" class="form-label">Organizer</label>
                    <input name="organizer" type="text" class="form-control" id="InputOrganizer" v-model="event.organizer" required>
                </div>
            </div>
            <div class="mb-2 col-lg-6">
                <label for="InputDescription" class="form-label">Description</label>
                <textarea name="description" type="text" class="form-control h-75" id="InputDescription" v-model="event.description" rows=4
                    required></textarea>
            </div>
            <div class="mb-2 col-lg-6">
                <label for="InputDatetime" class="form-label">Datetime</label>
                <input name="datetime" type="datetime-local" class="form-control" id="InputDatetime" v-model="event.datetime" required>
            </div>
            <div class="mb-2 col-lg-6">
                <label for="InputQutoa" class="form-label">Quota</label>
                <input name="quota" type="number" class="form-control" id="InputQutoa" placeholder="10" min="3" v-model="event.quota" required>
            </div>
            <div class="mb-4 col-lg-6">
                <label for="InputLocation" class="form-label">Location</label>
                <input name="location" id="InputLocation" class="form-control" placeholder="Apartment, studio or floor" v-model="event.location" required />
            </div>
            <div class="mb-4 col-lg-6">
                <label for="InputImage" class="form-label">Image</label>
                <input name="image" type="url" id="InputImage" class="form-control"
                    placeholder="http://image.com/example.jpg" v-model="event.image" required />
            </div>
            <div class="mb-4 px-3 form-check d-flex justify-content-between">
                <div class="mx-4">
                    <label class="form-check-label" for="InputHighlight">Highlight</label>
                    <input name="highlight" type="checkbox" class="form-check-input" id="InputHighlight" v-model="event.highlight" >
                </div>
                <button class="btn btn-primary px-4" type="submit">Save</button>
            </div>
        </form>

        <Spainner v-else-if="isLoading & !isSubmited" />

        <MessageCard v-else
            :messageType="messageType"
            :messageTitle="messageTitle"
            :messageBody="messageBody"
            :messageRedirectName="messageRedirectName"
            :messageRedirectPath="messageRedirectPath"
        />

    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Spainner from "../Spainner.vue";
import MessageCard from "../MessageCard.vue";
import { jwtDecode } from "jwt-decode";

const route = useRoute();
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

// display the response message message
const messageType = ref();
const messageTitle = ref();
const messageBody = ref();
const messageRedirectName = ref();
const messageRedirectPath = ref();

const api = '/api/v1/events';
const isLoading = ref(false);
const isSubmited = ref(false);
const isAdmin = ref(false);

const getEventRecord = async(id) => {
    isLoading.value = true;

    let response = await fetch(`${api}/${id}`);
    let result = await response.json();

    if (result.event) {
        event.value = result.event;
        
        // format for displaying the datetime
        const dt = new Date(event.value.datetime);
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
        event.value.datetime = dt.toISOString().slice(0, 16);
    }

    isLoading.value = false;
}

const sumbitEventForm = async() => {
    isLoading.value = true;
    const token = localStorage.getItem('token');

    let method = route.params.id ? 'PUT' : 'POST';
    let url = method == 'PUT' ? api + "/" + route.params.id : api;

    let data = JSON.stringify(event.value);

    let headers = {
        'Content-Type': 'application/json'
    }

    if (method == 'PUT') {
        headers.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(url, {
        method: method, 
        headers: headers,
        body: data
    });

    response = await response.json();

    if (response.message) {
        messageType.value = 'INFO';
        messageTitle.value = route.params.id ? "Update event success" : "Create event success "
        messageBody.value = response.message;
        messageRedirectName.value = route.params.id ? "See the updated event" : "See the new event"
        messageRedirectPath.value = route.params.id ? `/event/detail/${route.params.id}` : `/event/detail/${response._id}`;
    } else {
        messageType.value = 'ERROR';
        messageTitle.value = route.params.id ? "Update event failed" : "Create event failed "
        messageBody.value = response.message;
        messageRedirectName.value = route.params.id ? "Go back to event edit page" : "Create new event again"
        messageRedirectPath.value = route.params.id ? `/event/edit/${route.params.id}` : `/event/new`;
    }
    
    isSubmited.value = true;
    isLoading.value = true;
}

// check the user is admin or not
const checkIsAdmin = () => {
    const token = localStorage.getItem('token');

    if (token) {
        const decode = jwtDecode(token);

        if (decode.isAdmin) {
            isAdmin.value = true;
        }
    }

}

onMounted(() => {
    checkIsAdmin();
    if (route.params.id) {
        getEventRecord(route.params.id);
    }
});

</script>