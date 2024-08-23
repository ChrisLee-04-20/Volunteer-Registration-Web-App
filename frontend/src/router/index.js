import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EventsView from '../views/EventsView.vue';
import EventView from '../views/EventView.vue';
import EventDetailView from '../views/EventDetailView.vue';
import VolunteersView from '../views/VolunteersView.vue';
import VolunteerView from '../views/VolunteerView.vue';
import LoginView from '../views/LoginView.vue';
import MyEventsView from '../views/MyEventsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/event',
      name: 'event',
      component: EventsView
    },
    {
      path: '/event/new',
      name: 'eventNew',
      component: EventView
    },
    {
      path: '/event/detail/:id',
      name: 'eventDetail',
      component: EventDetailView
    },
    {
      path: '/event/edit/:id',
      name: 'eventEdit',
      component: EventView
    },
    {
      path: '/become/volunteer',
      name: 'becomeVolunteer',
      component: VolunteerView
    },
    {
      path: '/volunteers',
      name: 'volunteers',
      component: VolunteersView
    },
    {
      path: '/volunteer/:id',
      name: 'volunteersEdit',
      component: VolunteerView
    },
    {
      path: '/search/:keywords',
      name: 'eventsSearch',
      component: EventsView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }, 
    {
      path: '/myevents',
      name: 'myEvents',
      component: MyEventsView
    }
  ]
})

export default router
