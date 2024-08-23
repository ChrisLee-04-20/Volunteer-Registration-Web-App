<template>
    <div class="container-fluid px-4 mt-4">
        <div class="row">
            <p class="h3 mb-3" v-if="isVolunteer">Update profile</p>
            <form class="col-md-12 col-lg-6 mb-5 order-sm-2 order-lg-1" :class="[isVolunteer ? 'w-100 row' : '', '']"
                @submit.prevent="submitVolunteerForm" v-if="!isSubmited & !isLoading">
                <div class="mb-2" :class="[isVolunteer ? 'col-12 col-md-6' : '', '']">
                    <label for="InputEmail" class="form-label">Email</label>
                    <input name="email" type="email" class="form-control" id="InputEmail" v-model="volunteer.email"
                        required>
                </div>
                <div class="mb-2" :class="[isVolunteer ? 'col-12 col-md-6' : '', '']">
                    <label for="InputPassword" class="form-label">{{ props.isEdit && isVolunteer == null ? 'Reset Password'
                        : 'Password' }}</label>
                    <input name="password" type="password" class="form-control" id="InputPassword"
                        v-model="volunteer.password" v-bind="{ 'required': isPasswordRequired }">
                </div>
                <div class="mb-2" :class="[isVolunteer ? 'col-12 col-md-6' : '', '']">
                    <label for="InputName" class="form-label">Name</label>
                    <input name="name" type="text" class="form-control" id="InputName" v-model="volunteer.name" required>
                </div>
                <div class="mb-2" :class="[isVolunteer ? 'col-12 col-md-6' : '', '']">
                    <label for="InputContact" class="form-label">Contact</label>
                    <input name="contact" type="number" class="form-control" id="InputContact" v-model="volunteer.contact"
                        required>
                </div>
                <div class="mb-2" :class="[isVolunteer ? 'col-12 col-md-6' : '', '']">
                    <label for="InputAgeGroup" class="form-label">Age group</label>
                    <select name="ageGroup" class="form-select" id="InputAgeGroup" v-model="volunteer.ageGroup" required>
                        <option selected value="" disabled>Dropdown...</option>
                        <option v-for="option, index of ageOptions" :key="index" :value="ageOptionsValue[index]">
                            {{ option }}
                        </option>

                    </select>
                </div>
                <div class="mb-4" :class="[isVolunteer ? 'col-12 col-md-6' : '', '']">
                    <label for="InputPersonalIntro" class="form-label">About me and remark</label>
                    <textarea name="personalIntro" id="InputPersonalIntro" class="form-control"
                        v-model="volunteer.personalIntro" rows=5 required></textarea>
                </div>
                <div v-if="!isVolunteer" class="mb-4 form-check">
                    <input name="terms" type="checkbox" class="form-check-input" id="terms" v-model="volunteer.terms"
                        required>
                    <label class="form-check-label" for="terms">agree to terms and conditions</label>
                </div>
                <button type="submit" class="btn btn-primary px-4"
                    :class="[isVolunteer ? 'col-md-3 col-sm-6 col-xs-12 ms-2' : '', '']">{{ isEdit ? 'Save' : 'Register'
                    }}</button>
            </form>

            <div v-if="isAdmin" class="col-md-12 col-lg-6 mb-5 order-sm-2 order-lg-1">
                <o-table :data="eventsList" :loading="isLoadingEventsList" hoverable paginated :per-page="perPage">
                    <o-table-column v-slot="props" field="name" label="Event title" width=2 sortable>
                        {{ props.row.eventTitle }}
                    </o-table-column>
                    <o-table-column v-slot="props" field="action" label="Action" width=2>
                        <RouterLink class="btn btn-secondary shadow px-5" :to="`/event/detail/${props.row._id}`">Edit
                        </RouterLink>
                        <a class="btn btn-danger" @click="removeVolunteerFromEvent(`${props.row._id}`)">X</a>
                    </o-table-column>
                </o-table>
            </div>

            <Spainner v-if="isLoading" />

            <div v-if="isSubmited & !isLoading">
                <MessageCard :messageType="messageType" :messageTitle="messageTitle" :messageBody="messageBody"
                    :messageRedirectName="messageRedirectName" :messageRedirectPath="messageRedirectPath" />
            </div>

            <div v-if="!isEdit && route.params.id != 'new' && !isSubmited"
                class="col-md-12 col-lg-6 mb-sm-5 order-sm-1 order-lg-2">
                <div class="card w-100 mt-2" style="width: 18rem;">
                    <img src="https://picsum.photos/350/200" class="card-img-top img-fluid" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Become a volunteer!</h5>
                        <p class="card-text">You time and talent can make a real different in people's life.</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Spainner from "../Spainner.vue";
import MessageCard from "../MessageCard.vue";
import { jwtDecode } from 'jwt-decode';

const props = defineProps({
    isEdit: String,
    isVolunteer: String,
});

const route = useRoute();

const volunteer = ref({
    email: '',
    password: '',
    name: '',
    contact: '',
    ageGroup: '',
    personalIntro: '',
    terms: '',
});

const api = '/api/v1/volunteers';
const isEdit = ref(props.isEdit);
const isSubmited = ref(false);
const ageOptions = ref(['18 - 22', '23 - 30', '31 - 40', '41 - 50', '51 - 64', '65 or above']);
const ageOptionsValue = ref(['18-22', '23-30', '31-40', '41-50', '51-64', '65orAbove']);

const messageType = ref();
const messageTitle = ref();
const messageBody = ref();
const messageRedirectName = ref();
const messageRedirectPath = ref();

const isLoading = ref();
const isPasswordRequired = ref(route.params.id != null || route.params.id != '');
const volunteerId = ref();
const eventsList = ref();
const isLoadingEventsList = ref();
const perPage = ref(5);
const eventManageApi = '/api/v1/events/manage';
const isAdmin = ref(false);

const submitVolunteerForm = async () => {
    isLoading.value = true;
    isSubmited.value = true;

    const token = localStorage.getItem('token');
    let method;
    if (isEdit.value) {
        method = 'PUT';
    } else {
        method = 'POST';
    }

    let url = (method == 'PUT') ? api + "/" + volunteerId.value : api;

    let data = JSON.stringify(volunteer.value);

    const header = {
        'Content-Type': 'application/json'
    }

    if (method == 'PUT') {
        header.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(url, {
        method: method,
        headers: header,
        body: data
    });

    response = await response.json();

    showResponseMessage(response);
}

const showResponseMessage = (response) => {

    if (response.message) {
        messageType.value = 'INFO';
        messageTitle.value = volunteerId.value && route.params.id != 'new' ? "Update volunteer success" : "Become volunteer success "
        messageBody.value = response.message;
        messageRedirectName.value = props.isVolunteer ? "Go back yo my events" : "Go back to home page"
        messageRedirectPath.value = props.isVolunteer ? "/myevents" : '/';
    } else {
        messageType.value = 'ERROR';
        messageTitle.value = volunteerId.value ? "Update volunteer failed" : "Become volunteer failed"
        messageBody.value = response.error;
        messageRedirectName.value = props.isVolunteer ? "Go back update volunteer page" : "Go back to home page";
    }

    isLoading.value = false;
};

const getVolunteerRecord = async (id) => {
    isLoading.value = true;
    let response = await fetch(`${api}/${id}`);
    let result = await response.json();

    if (result.volunteer) {
        volunteer.value = result.volunteer;
    }

    isLoading.value = false;
}

const removeVolunteerFromEvent = async (eventId) => {
    const token = localStorage.getItem('token');

    let data = {
        eventId: eventId,
        volunteerId: route.params.id
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
        getJoinedEventsList(route.params.id);
    }

}

const getJoinedEventsList = async (volunteerId) => {
    const path = `/getVolunteerRecord/${volunteerId}`;
    const token = localStorage.getItem('token');

    isLoadingEventsList.value = true;

    let response = await fetch(eventManageApi + path, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })

    if (response.ok) {
        let result = await response.json();
        eventsList.value = result[0].joinedEvent;
    }

    isLoadingEventsList.value = false;
}

const checkIsAdmin = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token);
        if (decoded.isAdmin) {
            isAdmin.value = true;
            if (route.params.id != 'new') {
                getJoinedEventsList(route.params.id);
            }
        }
    }
}

onMounted(() => {
    if (route.params.id && route.params.id != 'new') {
        volunteerId.value = route.params.id;
        getVolunteerRecord(route.params.id);
        isPasswordRequired.value = false;
    }

    checkIsAdmin();

    if (props.isVolunteer) {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        volunteerId.value = decoded._id;
        getVolunteerRecord(decoded._id);
        isPasswordRequired.value = false;
    }

});

</script>