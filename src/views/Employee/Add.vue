<template>
    <div id="add-employee" class="add-employee add">
        <breadcrumbs :breadcrumbs="bread_add" />
        <div class="card">
            <div class="card-header">
                إضافة موظف
                <router-link to="/employee/list">
                    <v-btn color="primary" outlined>
                        عرض الموظفين
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <div class="row" style="align-items: center;">
                    <div class="col-lg-6">
                        <v-form>
                            <v-text-field outlined :reverse="true" v-model="name" :error-messages="nameErrors"
                                label="اسم الموظف "></v-text-field>
                            <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light
                                style="margin-top: 15px">
                                إضافة
                                <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                                    color="white"></v-progress-circular>
                            </v-btn>
                            <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000">
                                تم اضافة الموظف بنجاح
                                <template v-slot:action="{ attrs }">
                                    <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
                                        اغلاق
                                    </v-btn>
                                </template>
                            </v-snackbar>
                            <v-snackbar right bottom color="red" text v-model="error_snackbar" timeout="5000">
                                حدث خطأ غير متوقع، الرجاء اعادة المحاولة
                                <template v-slot:action="{ attrs }">
                                    <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
                                        اغلاق
                                    </v-btn>
                                </template>
                            </v-snackbar>
                        </v-form>
                    </div>
                    <div class="col-lg-6" style="display: flex;justify-content: center;">
                        <img src="@/assets/img/employee.png" style="width: 70%" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
    name: 'Addemployee',
    components: {
        Breadcrumbs,
    },
    mixins: [validationMixin],
    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        error_snackbar: false,
        bread_add: [
            {
                text: 'الموظفين',
                disabled: true,
                href: '',
            },
            {
                text: 'إضافة',
                disabled: false,
                href: '/employee/add',
            },
        ],
        name: '',
    }),
    validations: {
        name: { required },
    },
    computed: {
        nameErrors() {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.required && errors.push('هذا الحقل مطلوب')
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
            const token = localStorage.getItem("token")
            const formData = new FormData()
            formData.append('name', this.name)
            this.axios.post(this.$store.state.url + "/api/AddEmployee", formData, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.response = true
                    console.log(res.data)
                    if (res.data.message == "Store employee successfully") {
                        this.snackbar = true
                        this.name = ''
                        this.$v.$reset()
                    }
                    else
                        this.error_snackbar = true
                });
        },
    },
    mounted() {
    }
};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);
</style>
