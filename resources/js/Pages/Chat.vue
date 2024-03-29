<template>
    <app-layout title="Dashboard">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Chat
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8" >
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg flex " style="min-height: 400px; max-height: 400px;">

                    <!-- list users -->
                    <div class="w-3/12 bg-gray-200 bg-opacity-25 border-r border-gray-200 overflow-y-scroll  scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300">
                        <ul>
                            <li
                                v-for="user in users" :key="user.id"
                                @click="() => {loadMessages(user.id)}"
                                :class="(userActive && userActive.id == user.id) ? 'bg-gray-200 bg-opacity-50':''"
                                class="p-6 text-lg text-gray-600 leading-7  font-semibold border-b border-gray-200 hover:bg-gray-200 hover:bg-opacity-50 hover:cursor-pointer">
                                <p class="flex items-center">
                                    {{user.name}}
                                    <span v-if='user.notification' class="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                                </p>
                            </li>
                        </ul>
                    </div>

                    <!-- box message -->
                    <div class="w-9/12 flex flex-col justify-between ">

                        <!-- message -->
                        <div class="w-full p-6 flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300">
                            <div v-for="message in messages" :key="message.id"
                                :class="(message.from == $page.props.user.id) ? 'text-right' : ''"
                                class="w-full mb-3  message">
                                <p
                                    :class="(message.from == $page.props.user.id) ? 'bg-indigo-300' : 'bg-gray-300'"
                                    class="inline-block p-2 rounded-md bg-opacity-25" style="max-width: 75%;">
                                    {{message.content}}
                                </p>
                                <span class="block mt-1 text-xs text-gray-500">{{formatDate(message.created_at) }}</span>
                            </div>
                        </div>

                        <!-- form -->
                        <div v-if="userActive" class="w-full bg-gray-200 bg-opacity-25 p-6 border-t border-gray-200">
                            <form v-on:submit.prevent='sendMessage'>
                                <div class="flex rounded-md overflow-hidden border border-gray-300">
                                    <input  v-model="message" type="text" class="flex-1 px-4 py-2 text-sm focus:outline-none">
                                    <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2">Enviar</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
    import { defineComponent } from 'vue';
    import AppLayout from '@/Layouts/AppLayout.vue';
    import moment from 'moment';
    import store from '../store';

    store.dispatch('userStateAction');

    moment.locale('pt-br');

    export default defineComponent({
        components: {
            AppLayout,
        },
        data() {
            return {
                users:[],
                messages:[],
                userActive: null,
                message:''
            }
        },
        mounted() {
            axios.get('api/users').then(r => {
                this.users =  r.data.users;
            });

            Echo.private(`user.${this.user.id}`).listen('.SendMessage', async (e) => {
                if(this.userActive && this.userActive.id === e.message.from){
                    await this.messages.push(e.message);
                    this.scrollToBottom();
                }else{

                    this.users.filter((user) => {
                         if(user.id === e.message.from) {
                            this.users[this.users.indexOf(user)]['notification'] = true;
                         }
                    });

                }

            });
        },
        computed:{
            user() {
                return store.state.user;
            }
        },
        methods: {
            scrollToBottom: function(){
                if(this.messages.length){
                    document.querySelectorAll('.message:last-child')[0].scrollIntoView();
                }
            },
            loadMessages: async function(userId){
                axios.get(`api/users/${userId}`).then(r => {
                    this.userActive =  r.data.user;
                });

                await axios.get(`api/messages/${userId}`).then(r => {
                    this.messages =  r.data.messages;
                });

                this.users.filter((user) => {
                        if(user.id === userId) {
                            this.users[this.users.indexOf(user)]['notification'] = false;
                        }
                });


                this.scrollToBottom();
            },
            sendMessage: async function(userId){
                await axios.post(`api/messages/store`,{
                    'to': this.userActive.id,
                    'content': this.message
                }).then(r => {
                    this.messages.push({
                        'from': this.user.id,
                        'to': this.userActive.id,
                        'content': this.message,
                        'created_at': new Date().toISOString(),
                        'update_at': new Date().toISOString()
                    });

                    this.message = '';
                });

                this.scrollToBottom();
            },
            formatDate: (value) => {
                if (value) {
                    return moment(String(value)).format('DD/MM/YYYY HH:mm');
                }
            }
        },
    })
</script>
