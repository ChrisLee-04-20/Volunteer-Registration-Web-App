<template>
  <Navbar targetActive="home" />
  <main class="container-fluid px-5 overflow-hidden">
    <section>
      <div id="carouselExampleIndicators" class="carousel slide px-2 px-sm-0 my-4" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
            aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
            aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
            aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="https://picsum.photos/id/1/800/170" class="d-block vw-100 h-100 " alt="...">
          </div>
          <div class="carousel-item">
            <img src="https://picsum.photos/id/27/800/170" class="d-block vw-100 h-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="https://picsum.photos/id/4/800/170" class="d-block vw-100 h-100" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </section>

    <section>
      <ul class="nav nav-tabs mb-2">
        <li class="nav-item">
          <a class="nav-link active">Recent</a>
        </li>
      </ul>

      <!-- pass the events array to let the EventCards render the EventCard -->
      <EventCards v-if="events.length != 0" :isJoinable="isJoinable" :joinedEvents="volunteerJoinedEvents" :events="events" />

      <Spainner v-else />

    </section>

  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import Spainner from '../components/Spainner.vue';
import EventCards from '../components/event/EventCards.vue';
import { jwtDecode } from 'jwt-decode';

const api = '/api/v1/events';
const events = ref([]);

const eventsManageApi = '/api/v1/events/manage';
const volunteerJoinedEvents = ref();
const isJoinable = ref(null);

const getRecentEvent = async () => {
  let perPage = 3;
  let response = await fetch(`${api}?perPage=${perPage}`);

  response = await response.json();

  if (response.events) {
    events.value = response.events;
  }

}

const isVolunteer = () => {
  const token = localStorage.getItem('token')
    if (token) {
        const decoded = jwtDecode(token);
        if (decoded) {
            let isAdmin = decoded.isAdmin;

            if (!isAdmin || isAdmin == null || isAdmin == undefined) {
              isJoinable.value = 'true';
              getVolunteerJoinedEvents(decoded._id);
              return true;
            }
        }
    } else {
      return false;
    }
}

const getVolunteerJoinedEvents = async (volunteerId) => {
    const token = localStorage.getItem('token');
    const path = `/getVolunteerRecord/${volunteerId}`;

    let response = await fetch(eventsManageApi + path, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'GET',
    });
    
    if (response.ok) {
        response = await response.json();
        volunteerJoinedEvents.value = response[0].joinedEvent;
    }

    getRecentEvent();
}

onMounted(() => {
    const isVolunteerLoggedIn = isVolunteer();
    if (isVolunteerLoggedIn) {
    } else {
      getRecentEvent();
    }
});

</script>