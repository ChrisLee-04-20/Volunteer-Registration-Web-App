<template>
    <main class="container mt-5 d-flex justify-content-center align-items-center w-50">
        <form class="w-100" @submit.prevent="handleLogin">
            <div class="mb-3 row">
                <label for="staticEmail" class="col-sm-3 col-form-label">Email</label>
                <div class="col-sm-9">
                    <input type="email" class="form-control" id="staticEmail" v-model="email">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-3 col-form-label">Password</label>
                <div class="col-sm-9">
                    <input type="password" class="form-control" id="inputPassword" v-model="password">
                </div>
            </div>
            <div class="mb-3 row">
                <div class="col-2"></div>
                <p v-if="isShow" class="text-danger">{{ modalBody }}</p>
                <button class="btn btn-primary col-8 col-sm-5 col-md-3 mt-2" type="submit">Submit</button>
            </div>
        </form>

    </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import  Modal from "./Modal.vue"

const router = useRouter();
const email = ref('');
const password = ref('');
const url = '/api/v1/auth/login';

const isShow = ref(false);
const modalBody = ref();

const handleLogin = async() => {
    isShow.value = false;   

    let data = {
        email: email.value,
        password: password.value
    }
    data = JSON.stringify(data);

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });

    response = await response.json();

    if (response.token) {

        // save token to local storage
        localStorage.setItem('token', response.token);

        router.push('/');
    } else {
        modalBody.value = response.error;
        isShow.value = true;
    }
}

</script>