<template>
    <div id="add-appointment" class="add-appointment add">
        <breadcrumbs :breadcrumbs="bread_add" />
        <div class="card">
            <div class="card-header">
                إضافة مهمة
                <router-link to="/appointment/list">
                    <v-btn color="primary" outlined>
                        عرض المهمات
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-6">


                        <v-form>
                            <v-select outlined v-model="child_id" :reverse="true" :items="child_list" item-text="name"
                                item-value="id" label="اسم الطفل" :error-messages="childErrors"
                                @input="$v.child_id.$touch()"></v-select>
                        


                            <v-text-field outlined :reverse="true" v-model="title" :error-messages="titleErrors"
                                label=" عنوان المهمة"></v-text-field>


                            <v-select outlined v-model="user_id" :reverse="true" :items="user_list" item-text="name"
                                item-value="emp_id" label="اسناد المهمة لـ" :error-messages="userErrors"
                                @input="$v.user_id.$touch()"></v-select>

                            <v-text-field outlined :reverse="true" v-model="hours" :error-messages="hoursErrors"
                                label="عدد ساعات انجاز المهمة"></v-text-field>

                            <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light
                                style="margin-top: 15px">
                                إضافة
                                <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                                    color="white"></v-progress-circular>
                            </v-btn>
                            <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000">
                                تم اضافة المهمة بنجاح
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
                    <div class="col-lg-6">
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="app_date" persistent width="290px"
                                color="primary">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field outlined :reverse="true" v-model="app_date" label="تاريخ المهمة" readonly
                                        v-bind="attrs" class="my-date" v-on="on" append-icon="mdi-calendar"
                                        :error-messages="appDateErrors"></v-text-field>
                                </template>
                                <v-date-picker v-model="app_date" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="modal = false">
                                        إلغاء
                                    </v-btn>
                                    <v-btn text color="primary" @click="$refs.dialog.save(app_date)">
                                        موافق
                                    </v-btn>
                                </v-date-picker>
                            </v-dialog>
                            
                            <v-text-field outlined :reverse="true" v-model="description" :error-messages="desErrors"
                                label="تفاصيل المهمة"></v-text-field>
                        <img src="@/assets/img/app2.png" style="width: 90%; position: relative; top: -20px; right: 20px;" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'
export default {
    name: 'AddAppointment',
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
                text: 'المهمات',
                disabled: true,
                href: '',
            },
            {
                text: 'إضافة',
                disabled: false,
                href: '/appointment/add',
            },
        ],
        child_id: '',
        app_date: null,
        child_list: [],
        user_list: [],
        modal: false,
        app_id: null,
        user_id: null,
        hours: null,
        description: null,
        title: null
    }),
    validations: {
        child_id: { required },
        app_date: { required },
        user_id: { required },
        hours: { required, numeric },
        description: { required },
        title: { required },
    },

    computed: {
        childErrors() {
            const errors = []
            if (!this.$v.child_id.$dirty) return errors
            !this.$v.child_id.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        appDateErrors() {
            const errors = []
            if (!this.$v.app_date.$dirty) return errors
            !this.$v.app_date.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        userErrors() {
            const errors = []
            if (!this.$v.user_id.$dirty) return errors
            !this.$v.user_id.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        hoursErrors() {
            const errors = []
            if (!this.$v.hours.$dirty) return errors
            !this.$v.hours.required && errors.push('هذا الحقل مطلوب')
            !this.$v.hours.numeric && errors.push('الرجاء ادخال عدد الساعات كرقم')
            return errors
        },
        desErrors() {
            const errors = []
            if (!this.$v.description.$dirty) return errors
            !this.$v.description.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        titleErrors() {
            const errors = []
            if (!this.$v.title.$dirty) return errors
            !this.$v.title.required && errors.push('هذا الحقل مطلوب')
            return errors
        }
    },
    methods: {

        submit() {
            this.$v.$touch()
            if (!this.$v.$error) {
                this.isSubmit = true
                this.sendData_1()
            }
        },

        sendData_1() {
            console.log(this.child_id)
            console.log(this.app_date)
            const token = localStorage.getItem("token")
            const formData = new FormData()
            formData.append('child_id', this.child_id)
            formData.append('app_date', this.app_date)
            this.axios.post(this.$store.state.url + "/api/Store_Appointment", formData, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.response = true
                    console.log(res.data)
                    this.app_id = res.data.Appointment.id
                    if (res.data.message == 'An Appointment has been booked successfully') {
                        this.sendData_2()
                    }
                    else
                        this.error_snackbar = true
                });
        },
        sendData_2() {
            const token = localStorage.getItem("token")
            const formData = new FormData()
            formData.append('user_id', this.user_id)
            formData.append('app_id', this.app_id)
            formData.append('hours', this.hours)
            formData.append('description', this.description)
            formData.append('title', this.title)
            formData.append('check', 0)
            formData.append('notes', "Ededede")

            this.axios.post(this.$store.state.url + "/api/Store_Task", formData, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.response = true
                    console.log(res.data)
                    if (res.data.message == 'A Task has been booked successfully') {
                        this.$router.replace({ name: 'appointment-list' })
                    }
                    else
                        this.error_snackbar = true
                });
        },
        getChild() {
            this.axios.get(this.$store.state.url + "/api/childs/names")
                .then(res => {
                    this.child_list = res.data.data
                    console.log(res.data.data)
                });
        },
        getUser() {
            const token = localStorage.getItem("token")
            this.axios.get(this.$store.state.url + "/api/show_Employee",  { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.user_list = res.data.data
                    console.log(res.data)
                });
        }
    },
    mounted() {
        this.getChild()
        this.getUser()
    }
};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);


.my-date .v-label--active {
    right: -30px !important
}
</style>
