<template>
    <div class="login">
        <div class="container">
            <v-card class="login-card">
                <div class="row" style="align-items: center;">
                    <div class="col-lg-6">
                        <h3 class="my-title"> تسجيل دخول مدير</h3>
                        <v-form style="margin-top: 70px">
                            <v-text-field type="email" outlined :reverse="true" v-model="email"
                                :error-messages="emailErrors" label="البريد الالكتروني"></v-text-field>
                            <v-text-field type="password" outlined :reverse="true" v-model="unique"
                                :error-messages="uniqueErrors" label="كلمة المرور"></v-text-field>
                        </v-form>
                        <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light
                            style="margin-top: 15px">
                            تسجل الدخول
                            <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                                color="white" style="margin-right: 15px;"></v-progress-circular>
                        </v-btn>
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
import { required, email, numeric } from 'vuelidate/lib/validators'

export default {
    name: 'Login',
    components: {
    },
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        unique: { required, numeric },
    },

    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        email: null,
        unique: null
    }),

    computed: {
        emailErrors() {
            const errors = []
            if (!this.$v.email.$dirty) return errors
            !this.$v.email.required && errors.push('هذا الحقل مطلوب')
            !this.$v.email.email && errors.push('الرجاء ادخال بريد الكتروني صحيح')
            return errors
        },
        uniqueErrors() {
            const errors = []
            if (!this.$v.unique.$dirty) return errors
            !this.$v.unique.required && errors.push('هذا الحقل مطلوب')
            !this.$v.unique.numeric && errors.push('الرجاء ادخال رمز مكون من ارقام فقط')
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
            console.log(this.email)
            console.log(this.unique)
            const formData = new FormData()
            formData.append('email', this.email)
            formData.append('password', this.unique)

            formData.append('role', 'admin')
            this.axios.post(this.$store.state.url + "/api/LoginAdmin", formData)
                .then(res => {
                    this.response = true
                    console.log(res)
                    if (res.data.message == "Your information is not true !! you are not Admin ") {
                        this.email = ''
                        this.unique = ''
                        this.snackbar = true
                        this.$v.$reset()
                    }
                    else{
                        this.addtoStore(res.data.token, res.data.user.id, res.data.user.name, res.data.user.email, res.data.user.role)
                        this.addlocalStorage(res.data.token, res.data.user.id, res.data.user.name, res.data.user.email, res.data.user.role)
                        this.$router.replace({ name: 'dashboard' })
                    } 
                });
        },
        addtoStore(token, id, name, email, role){
            this.$store.state.token = token
            this.$store.state.id = id
            this.$store.state.name = name
            this.$store.state.email = email
            this.$store.state.role = role
        },
        addlocalStorage(token, id, name, email, role){
            localStorage.setItem("token", token)
            localStorage.setItem("id", id)
            localStorage.setItem("name", name)
            localStorage.setItem("email", email)
            localStorage.setItem("role", role)
        }
    },

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
