<template>
    <div class="row mt-3 px-3">
        <div v-if="props.events.length != 0" class="card-group">         
            <div v-for="event of props.events" :key="event._id" class="col-12 col-md-6 col-lg-4 mb-3">    
                <EventCard :isEditable="props.isEditable" 
                    :isJoinable="checkJoinable(event._id)" 
                    :event="event" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import EventCard from './EventCard.vue';

const props = defineProps({
    events: Array,
    isEditable: String,
    isJoinable: String,
    joinedEvents: Object
});

const joinedEventsId = ref([]);

onMounted(async() => {
    if (props.joinedEvents && props.isJoinable == 'true') {
        const eventsId = [];
        props.joinedEvents.map((event) =>  eventsId.push(event._id))
        joinedEventsId.value = eventsId;
    }
})

const checkJoinable = (eventId) => {
    return !joinedEventsId.value.includes(eventId) && props.isJoinable == 'true';
};

</script>