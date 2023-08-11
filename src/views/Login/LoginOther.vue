<template>
    <div class="login">
        <div class="container">
            <v-card class="login-card">
                <div class="row" style="align-items: center;">
                    <div class="col-lg-6">
                        <h3 class="my-title">تسجيل دخول اخصائي</h3>
                        <v-form style="margin-top: 70px">
                            <v-text-field type="email" outlined :reverse="true" v-model="email"
                                :error-messages="emailErrors" label="البريد الالكتروني"></v-text-field>
                            <v-text-field type="password" outlined :reverse="true" v-model="password"
                                :error-messages="passwordErrors" label="كلمة المرور"></v-text-field>
                        </v-form>
                        <div class="row" style="margin-right: 5px">
                            <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light
                                style="margin-top: 15px">
                                تسجل الدخول
                                <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate color="white"
                                    style="margin-right: 15px;"></v-progress-circular>
                            </v-btn>
                            <router-link to="/register/specialist">
                                <v-btn color="primary" outlined style="margin-top: 15px; margin-right: 30px">
                                    انشاء حساب
                                </v-btn>
                            </router-link>
                        </div>
                        <v-snackbar left bottom color="red" text v-model="snackbar" timeout="5000">
                            المعلومات المدخلة غير صحيحة، الرجاء اعادة المحاولة
                            <template v-slot:action="{ attrs }">
                                <v-btn color="red " text v-bind="attrs" @click="snackbar = false">
                                    اغلاق
                                </v-btn>
                            </template>
                        </v-snackbar>
                    </div>
                    <div class="col-lg-6 left">
                        <img src="../../assets/img/logo2.jpg" style="width: 75%" />
                    </div>
                </div>
            </v-card>
        </div>
    </div>
</template>


<script>

import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
    name: 'Login',
    components: {
    },
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        password: { required },
    },

    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        email: '',
        password: '',
    }),

    computed: {
        emailErrors() {
            const errors = []
            if (!this.$v.email.$dirty) return errors
            !this.$v.email.required && errors.push('هذا الحقل مطلوب')
            !this.$v.email.email && errors.push('الرجاء ادخال ادخال بريد الكتروني صحيح')
            return errors
        },
        passwordErrors() {
            const errors = []
            if (!this.$v.password.$dirty) return errors
            !this.$v.password.required && errors.push('هذا الحقل مطلوب')
            return errors
        }
    },
    methods: {
        submit() {
            this.$v.$touch()
            if (!this.$v.$error) {
                this.isSubmit = true
                this.sendData()
            }
        },
        sendData() {
            console.log(this.unique)
            const formData = new FormData()
            formData.append('email', this.email)
            formData.append('password', this.password)
            formData.append('role', 'Specialist')
            this.axios.post(this.$store.state.url + "/api/emp/login", formData)
                .then(res => {
                    this.response = true
                    console.log(res.data)
                    if (res.data.message == "login success") {
                        this.addlocalStorage(res.data.data.token, res.data.data.emp_id, res.data.data.name, res.data.data.email, "specialist")
                        this.$router.replace({ name: 'dashboard' })
                    }
                    else {
                        this.unique = ''
                        this.snackbar = true
                        this.$v.$reset()
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        // Handle 404 error
                        this.response = true
                        this.unique = ''
                        this.snackbar = true
                        this.$v.$reset()
                    } else {
                        // Handle other errors
                        console.error(error);
                    }
                });
        },
        addlocalStorage(token, id, name, email, role) {
            localStorage.setItem("token", token)
            localStorage.setItem("id", id)
            localStorage.setItem("name", name)
            localStorage.setItem("email", email)
            localStorage.setItem("role", role)
        }
    },
    mounted() {
    }

};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);

.login .my-title {
    color: var(--v-primary-base);
    font-weight: bold;
}

.login .login-card {
    border: none;
    border-radius: 20px;
    padding: 50px 80px;
    margin: 60px 0px 50px;
    box-shadow: 0 0 10px #c5c5c5 !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 50px;
}

.login .left {
    display: flex;
    justify-content: center;
    align-items: center;
}

.login .v-messages__message {
    text-align: justify;
}
</style>
