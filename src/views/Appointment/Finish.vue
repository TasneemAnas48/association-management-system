<template>
    <div id="tash-finish" class="tash-finish add">
        <div class="card">
            <div class="card-header">
                تفاصيل المهمة
                <router-link to="/appointment/list">
                    <v-btn color="primary" outlined>
                        عرض المهمات
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <div class="row" style="align-items: center;" v-if="load">

                    <div class="col-lg-12">
                        <v-simple-table style="padding: 0px;">
                            <template v-slot:default>
                                <tbody>
                                    <tr>
                                        <td>اسم الطفل</td>
                                        <td>{{ task_details.child_name }}</td>
                                    </tr>
                                    <tr>
                                        <td>عنوان المهمة</td>
                                        <td>{{ task_details.title }}</td>
                                    </tr>
                                    <tr>
                                        <td>تفاصيل المهمة</td>
                                        <td>{{ task_details.description }}</td>
                                    </tr>
                                    <tr>
                                        <td> تاريخ المهمة</td>
                                        <td>{{ task_details.date_task }}</td>
                                    </tr>
                                    <tr>
                                        <td> عدد ساعات انجاز المهمة</td>
                                        <td>{{ task_details.hours }}</td>
                                    </tr>
                                    <tr>
                                        <td> اسم الموظف </td>
                                        <td>{{ task_details.user_name }}</td>
                                    </tr>
                                    <tr>
                                        <td> ملاحظات الموظف </td>
                                        <td>{{ task_details.notes }}</td>
                                    </tr>
                                    <tr v-if="task_details.points == null">
                                        <td> النقاط </td>
                                        <td><v-btn @click="dialogTask = true" color="primary" light
                                                style="margin: 15px 0px">
                                                اسناد نقاط للموظف
                                            </v-btn></td>
                                    </tr>
                                    <tr v-else>
                                        <td> النقاط </td>
                                        <td>{{ task_details.points }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                        <v-dialog v-model="dialogTask" max-width="600px">
                            <v-card>
                                <v-spacer></v-spacer>
                                <v-card-title class="justify-content-start"
                                    style="border-bottom: 1px solid #aeaeae;padding-top: 30px;font-weight: bold;margin-bottom: 40px;">
                                    اسناد نقاط للموظف
                                </v-card-title>
                                <div style="margin: 0px 30px">
                                    <v-form>
                                        <v-text-field outlined :reverse="true" v-model="points"
                                            :error-messages="pointsErrors" label=" النقاط المستحقة"></v-text-field>
                                    </v-form>
                                </div>
                                <v-divider></v-divider>
                                <v-card-actions style="justify-content: end; padding-bottom: 30px;margin-left: 20px;">
                                    <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light>
                                        إرسال
                                        <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                                            color="white" style="margin-right: 10px"></v-progress-circular>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000">
                            تم إرسال اسناد النقاط بنجاح
                            <template v-slot:action="{ attrs }">
                                <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
                                    اغلاق
                                </v-btn>
                            </template>
                        </v-snackbar>
                        <v-snackbar right bottom color="red" text v-model="error_snackbar" timeout="5000">
                            حدث خطأ غير متوقع، الرجاء إعادة المحاولة
                            <template v-slot:action="{ attrs }">
                                <v-btn color="red" text v-bind="attrs" @click="error_snackbar = false">
                                    اغلاق
                                </v-btn>
                            </template>
                        </v-snackbar>
                    </div>
                </div>
                <div class="progress-container" v-else>
                    <v-progress-circular indeterminate color="primary" :size="50"
                        style="margin-top: 100px"></v-progress-circular>
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
    name: 'Parent',
    components: {
        Breadcrumbs,
    },
    mixins: [validationMixin],
    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        error_snackbar: false,
        points: '',
        task_id: '',
        task_details: null,
        load: false,
        dialogTask: false,
    }),
    validations: {
        points: { required, numeric },
    },
    computed: {
        pointsErrors() {
            const errors = []
            if (!this.$v.points.$dirty) return errors
            !this.$v.points.required && errors.push('هذا الحقل مطلوب')
            !this.$v.points.numeric && errors.push('الرجاء ادخال عدد النقاط رقم')
            return errors
        },

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
            formData.append('points', this.points)
            formData.append('task_id', this.task_id)
            this.axios.post(this.$store.state.url + "/api/storeBouns", formData)
                .then(res => {
                    this.response = true
                    console.log(res.data)
                    if (res.data.message == "Bouns send successfully") {
                        window.location.reload()
                    }
                    else
                        this.error_snackbar = true
                }).catch(error => {
                    this.error_snackbar = true
                })
        },
        getTaskDetails() {
            this.task_id = this.$route.params.id
            this.axios.get(this.$store.state.url + "/api/task/details/" + this.task_id)
                .then(res => {
                    this.load = true
                    this.task_details = res.data.data
                    console.log(res.data.data)
                });
        },
    },
    mounted() {
        // window.location.reload()
        this.getTaskDetails()
    }
};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);

.parent .v-text-field__slot {
    right: 12px;
}
</style>
