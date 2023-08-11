<template>
    <div class="login">
        <div class="container">
            <v-card class="login-card">
                <div class="row" style="align-items: center;">
                    <div class="col-lg-6">
                        <h3 class="my-title">انشاء حساب اخصائي</h3>
                        <v-form style="margin-top: 70px">
                            <v-text-field type="email" outlined :reverse="true" v-model="email"
                                :error-messages="emailErrors" label="البريد الالكتروني"></v-text-field>
                            <v-text-field type="password" outlined :reverse="true" v-model="password"
                                :error-messages="passwordErrors" label="كلمة المرور"></v-text-field>
                            <v-text-field type="password" outlined :reverse="true" v-model="confrim"
                                :error-messages="confrimErrors" label="تأكيد كلمة المرور"></v-text-field>
                        </v-form>
                        <div class="row" style="margin-right: 5px">
                            <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light
                                style="margin-top: 15px">
                                انشاء حساب
                                <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate color="white"
                                    style="margin-right: 15px;"></v-progress-circular>
                            </v-btn>
                        </div>
                        <v-snackbar left bottom color="red" text v-model="snackbar" timeout="5000">
                            المعلومات المدخلة غير صحيحة، الرجاء اعادة المحاولة
                            <template v-slot:action="{ attrs }">
                                <v-btn color="red " text v-bind="attrs" @click="snackbar = false">
                                    اغلاق
                                </v-btn>
                            </template>
                        </v-snackbar>
                        <v-snackbar left bottom color="green" text v-model="true_snackbar" timeout="5000">
                            تم انشاء الحساب بنجاح، يمكنك الان تسجيل الدخول
                            <template v-slot:action="{ attrs }">
                                <router-link to="/login/specialist">
                                    <v-btn color="green" text v-bind="attrs" @click="true_snackbar = false">
                                        تسجيل الدخول
                                    </v-btn>
                                </router-link>
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
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
    name: 'Login',
    components: {
    },
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        password: { required, minLength: minLength(8) },
        confrim: { required, sameAs: sameAs('password') },
    },

    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        true_snackbar: false,
        email: '',
        password: '',
        confrim: ''
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
            !this.$v.password.minLength && errors.push('الرجاء ادخال كلمة مرور لا تقل عن 8 رموز')
            return errors
        },
        confrimErrors() {
            const errors = []
            if (!this.$v.confrim.$dirty) return errors
            !this.$v.confrim.required && errors.push('هذا الحقل مطلوب')
            !this.$v.confrim.sameAs && errors.push('الرجاء ادخال كلمة مرور متطابقة')
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
            const formData = new FormData()
            formData.append('email', this.email)
            formData.append('password', this.password)
            formData.append('role', 'Specialist')
            this.axios.post(this.$store.state.url + "/api/emp/register", formData)
                .then(res => {
                    this.response = true
                    console.log(res.data)
                    if (res.data.message == "register success") {
                        this.true_snackbar = true
                    }
                    else {
                        this.snackbar = true
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
        addtoStore(token, id, name, email, role) {
            this.$store.state.token = token
            this.$store.state.id = id
            this.$store.state.name = name
            this.$store.state.email = email
            this.$store.state.role = role
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
