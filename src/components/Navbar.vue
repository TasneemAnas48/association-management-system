<template>
    <b-navbar>
        <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <!-- <b-icon icon="bell-fill"></b-icon> -->

                <b-nav-item-dropdown right>
                    <template #button-content>
                        <v-badge v-if="messages != 0" :content="messages" style="left: 41px;top: 0px;position: absolute;"
                            bordered overlap color="green"></v-badge>
                        <b-icon icon="bell-fill"></b-icon>
                    </template>
                    <div class="new">
                        <b-dropdown-item v-for="(item, index) in new_notification" :key="index"
                            @click="display_task(item.id)">
                            <div class="title">
                                {{ item.title }}
                            </div>
                            <div class="disc">
                                {{ item.message }}
                            </div>
                        </b-dropdown-item>
                    </div>

                    <b-dropdown-item v-for="(item, index) in notification" :key="index" @click="display_task(item.id)">
                        <div class="title">
                            انهاء مهمة
                        </div>
                        <div class="disc">
                            تم انهاء المهمة "{{ item.title }}" بنجاح
                        </div>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
                <!-- <v-btn @click="finish()">Finish task</v-btn> -->
                <v-snackbar right top color="green" text v-model="snackbar" timeout="4000">{{ single_new }}
                </v-snackbar>
                <!-- <b-nav-item-dropdown right>
                    <template #button-content>
                        <b-icon icon="person-fill"></b-icon>
                    </template>
                    <b-dropdown-item @click="logout">تسجيل خروج</b-dropdown-item>
                </b-nav-item-dropdown> -->
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>

export default {
    name: 'Navbar',

    data: () => ({
        notification: [],
        new_notification: [],
        messages: 0,
        snackbar: false,
        single_new: ''
    }),
    // computed: {
    //     isAr() {
    //         this.lang = localStorage.getItem("lang")
    //         console.log(this.lang)
    //         return this.lang
    //     },
    // },
    methods: {
        logout() {
            this.removeFromStore()
            this.removeFromlocalStorage()
            this.$router.replace({ name: 'welcome' })
        },
        removeFromStore() {
            this.$store.state.token = null
            this.$store.state.id = null
            this.$store.state.name = null
            this.$store.state.email = null
            this.$store.state.role = null
        },
        removeFromlocalStorage() {
            localStorage.setItem("token", '')
            localStorage.setItem("id", '')
            localStorage.setItem("name", '')
            localStorage.setItem("email", '')
            localStorage.setItem("role", '')
        },
        finish() {
            const formData = new FormData()
            formData.append('notes', "eeeeeeeee")
            this.axios.post(this.$store.state.url + "/api/task/terminate/3", formData)
                .then(res => {
                    // console.log(res.data)
                });
        },
        getPusher() {
            var channel = this.$pusher.subscribe("public-channel.1.5")
            var that = this;
            channel.bind('NotificationEvent', function (data) {
                console.log(data)
                that.single_new = data.message
                that.snackbar = true
                that.new_notification.push(data)
                that.new_notification = that.new_notification.reverse()
                that.increase_messsage()
                // console.log(that.new_notification)
                // that.notification_data.push(data)
                // that.notification_data = that.notification_data.reverse()
                // console.log(that.notification_data)
                // that.increase_messsage()
                // console.log(that.messages)
                // if (that.notification_data.length != 0)
                //     that.empty2 = false
            });
        },
        increase_messsage() {
            this.messages = this.messages + 1
            // console.log(this.messages)
        },
        getNotification() {
            this.axios.get(this.$store.state.url + "/api/admin/notifications/1")
                .then(res => {
                    this.notification = res.data.data
                    // this.notification = this.notification.reverse()
                    // console.log(res.data.data)
                })
        },
        display_task(id) {
            this.$router.replace({ name: 'task-finish', params: { id: id } })
        }
    },
    mounted() {
        this.getPusher()
        this.getNotification()
    }
};
</script>

<style lang="scss">
.navbar {
    background-color: white;
    border-bottom: 1px solid #e6e6e6;
    box-shadow: 0 0 10px #e4e4e4;
    padding: 15px !important;
}

.new {
    background-color: #dedede85;
}

.navbar .bi-person-fill {
    font-size: 25px !important;
}


.navbar .bi-bell-fill {
    font-size: 25px !important;
}

.navbar-nav .nav-link {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    font-size: 18px;
}

.navbar .nav-item {
    margin: 0px 10px;
}

.navbar-nav .nav-link {
    direction: rtl;
}

.navbar .dropdown-menu {
    padding: 10px 0px;
    height: 315px;
    overflow: auto;
}

.navbar .dropdown-toggle::after {
    display: none !important;
}

.navbar .nav-link {
    background-color: #e9e9e9;
    border-radius: 20px;
}

.navbar .dropdown-item {
    text-align: justify;
    border-bottom: 1px solid #80808054;
    padding-bottom: 15px;
}

.navbar-light .navbar-nav .nav-link {
    color: var(--v-primary-base) !important;
}

.dropdown-item:active {
    color: #fff;
    text-decoration: none;
    background-color: var(--v-primary-base) !important;
}
</style>