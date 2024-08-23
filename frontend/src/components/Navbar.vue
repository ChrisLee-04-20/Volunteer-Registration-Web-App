<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a href="#" class="navbar-brand">Navbar</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item me-3">
                            <a class="nav-link" :class="{ active: targetActive == 'home' }" aria-current="page"
                                href="/">Home</a>
                        </li>
                        <li class="nav-item me-3">
                            <a class="nav-link" :class="{ active: targetActive == 'events' }" href="/event">Events</a>
                        </li>
                        <li class="nav-item me-3" v-if="!isLoggedIn">
                            <a class="nav-link" :class="{ active: targetActive == 'volunteer' }"
                                href="/become/volunteer">Become volunteer</a>
                        </li>
                        <li class="nav-item me-3" v-if="isAdmin">
                            <a class="nav-link" :class="{ active: targetActive == 'volunteers' }"
                                href="/volunteers">Volunteers</a>
                        </li>
                        <li class="nav-item me-3" v-if="isVolunteer">
                            <a class="nav-link" :class="{ active: targetActive == 'myevents' }"
                                href="/myevents">My events</a>
                        </li>
                    </ul>
                    <form class="d-flex" role="search" @submit="searchEvents">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                            v-model="searchKeywords">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    <a v-if="!isLoggedIn" href="/login" class="mx-0 mx-sm-3 mt-3 mt-lg-0  px-4 btn btn-primary">Login</a>
                    <a v-else @click="handleLogout" href="/" class="mx-0 mx-sm-3 mt-3 mt-lg-0  px-4 btn btn-outline-primary">Logout</a>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { jwtDecode } from "jwt-decode";

const props = defineProps({
    targetActive: String,
});

const searchKeywords = ref('');
const targetActive = ref(props.targetActive);
const router = useRouter();

// check the user is admin or volunteer
const isLoggedIn = ref(false);
const isAdmin = ref(false);
const isVolunteer = ref(false);

const searchEvents = async () => {
    if (searchKeywords.value == '' || searchKeywords.value == null) {
        return;
    }

    router.push(`/search/${searchKeywords.value}`);
}

const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (token != null) {
        isLoggedIn.value = true;
        const decoded = jwtDecode(token);
        console.log(decoded);
        decoded.isAdmin ? isAdmin.value = true : isVolunteer.value = true;
    }
}

const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
}

onMounted(() => {
    isUserLoggedIn();
})

</script>