<template>
    <!-- Display the dialog -->
    <div class="modal" id="message" tabindex="-1" aria-labelledby="message" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-light" :class="[modalType == 'Warning' ? 'bg-danger' : 'bg-primary']">
                    <h5 class="modal-title">{{ props.modalTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>{{ modalBody }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button v-if="modalAction" type="button" class="btn" :class="[modalType == 'Warning' ? 'btn-danger' : 'btn-primary']" data-bs-dismiss="modal"
                        @click="handleAction">{{ modalBtn }}</button>
                    <!-- <RouterLink v-else :to="modalActionUrl" class="btn" :class="[modalType == 'Warning' ? 'btn-danger' : 'btn-primary']">
                        {{ modalBtn }}
                    </RouterLink> -->
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
    modalType: String,                          // set the color of the modal
    modalTitle: String,         
    modalBody: String,
    modalBtn: String,                           // set the btn name
    modalAction: String,                        // set the request method
    modalActionUrl: String,                      // set the target url
    redirectLink: String
});

const handleAction = async () => {
    const token = localStorage.getItem('token');

    let response = await fetch(props.modalActionUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: props.modalAction
    });

    response = await response.json();

    // handle the display success message or error message later 
    alert(response.message);

    router.push(props.redirectLink);

}

onMounted(() => {

})

</script>