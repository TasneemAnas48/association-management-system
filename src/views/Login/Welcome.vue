<template>
    <div class="welcome">
        <div class="container">
            <v-card class="welcome-card">
                <h2 class="my-title">
                    اهلا بك في جمعية الرازي للتربية الخاصة
                </h2>
                <img src="../../assets/img/logo.jpg" style="width: 30%" />
                <div class="row">
                    <router-link to="/login/admin">
                        <v-btn color="primary" light style="margin: 25px;font-size: 18px; padding: 20px;">
                            تسجل دخول مدير
                        </v-btn>
                    </router-link>
                    <router-link to="/login/specialist">
                        <v-btn color="primary" light style="margin: 25px;font-size: 18px; padding: 20px;">
                            تسجل دخول اخصائي
                        </v-btn>
                    </router-link>
                </div>
            </v-card>
        </div>
    </div>
</template>


<script>
export default {
    name: 'welcome',
    components: {
    },

    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        checkbox: false,
    }),

    computed: {
    },

};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);

.welcome .my-title {
    color: var(--v-primary-base);
    font-weight: bold;
}

.welcome .welcome-card {
    border: none;
    border-radius: 20px;
    padding: 50px 80px;
    margin: 20px 0px 50px;
    box-shadow: 0 0 10px #c5c5c5 !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 50px;
}

.welcome .left {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
