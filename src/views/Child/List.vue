<template>
    <div id="list-child" class="list-child list">
        <breadcrumbs :breadcrumbs="bread" />
        <div class="card">
            <div class="card-header">
                عرض الأطفال
                <router-link to="/child/add">
                    <v-btn color="primary" outlined>
                        إضافة طفل
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <div>
                    <v-card-title>
                        <div class="row">
                            <div class="col-lg-5">
                                <v-text-field :reverse="true" v-model="search" append-icon="mdi-magnify" label="ابحث"
                                    single-line hide-details></v-text-field>
                            </div>
                            <div class="col-lg-2"></div>
                            <div class="col-lg-5">
                                <v-select class="filter" v-model="filter" :reverse="true" :items="filter_list" single-line
                                    hide-details append-icon="mdi-filter" label="فلترة حسب شدة الاصابة"></v-select>
                            </div>
                        </div>
                    </v-card-title>
                    <v-data-table :headers="headers" :items="data" :search="search" class="my-table" v-if="load">
                        <template v-slot:top>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card>
                                    <v-spacer></v-spacer>
                                    <v-card-title class="justify-content-center" style="padding-top: 30px">
                                        هل انت متأكد من انك تريد حذف الطفل
                                    </v-card-title>
                                    <v-card-actions style="padding-bottom: 30px">
                                        <v-spacer></v-spacer>
                                        <v-btn color="gray" text @click="closeDelete">إلغاء
                                        </v-btn>
                                        <v-btn color="red darken-1" text @click="deleteItemConfirm">تأكيد
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <div class="row justify-content-center">
                                <div @click="editItem(item)">
                                    <i class="fas fa-pen"></i>
                                </div>
                                <div @click="deleteItem(item)">
                                    <i class="fa fa-trash"></i>
                                </div>
                                <div @click="displayItem(item)">
                                    <i class="fa fa-eye"></i>
                                </div>
                            </div>
                        </template>

                        <template v-slot:[`item.study_status`]="{ item }">
                            <div @click="study_status(item)">
                                <i class="fas fa-edit"></i>
                            </div>
                        </template>
                        <template v-slot:[`item.report`]="{ item }">
                            <div @click="report(item)">
                                <i class="	fas fa-file-archive"></i>
                            </div>
                        </template>
                        <template v-slot:[`item.test`]="{ item }">
                            <div @click="test(item)">
                                <i class="fas fa-list"></i>
                            </div>
                        </template>
                    </v-data-table>
                    <div class="progress-container" v-else>
                        <v-progress-circular indeterminate color="primary" :size="50"
                            style="margin-top: 100px"></v-progress-circular>
                    </div>
                </div>
                <v-snackbar right bottom color="green" text v-model="snackbar_delete" timeout="5000">
                    تم حذف الطفل بنجاح
                    <template v-slot:action="{ attrs }">
                        <v-btn color="green" text v-bind="attrs" @click="snackbar_delete = false">
                            اغلاق
                        </v-btn>
                    </template>
                </v-snackbar>
                <v-snackbar right bottom color="red" text v-model="error_snackbar_delete" timeout="5000">
                    حدث خطأ غير متوقع، الرجاء اعادة المحاولة
                    <template v-slot:action="{ attrs }">
                        <v-btn color="red" text v-bind="attrs" @click="error_snackbar_delete = false">
                            اغلاق
                        </v-btn>
                    </template>
                </v-snackbar>
            </div>
            <v-dialog v-model="DialogReport" max-width="500px">
                <v-card>
                    <v-card-title>إصدار تقرير للطفل</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="justify-content-center" style="padding: 10px 30px">
                        <v-text-field hide-details outlined :reverse="true" v-model="recomm"
                            label="التوصيات "></v-text-field>
                        <v-text-field hide-details outlined :reverse="true" v-model="summary"
                            label="الخلاصة "></v-text-field>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn color="green darken-1" text @click="confrim_report">إرسال
                        </v-btn>
                        <v-btn color="gray" text @click="DialogReport = false">إلغاء
                        </v-btn>
                    </v-card-actions>
                    <v-spacer></v-spacer>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"

export default {
    name: 'childList',
    components: {
        Breadcrumbs
    },
    data: () => ({
        headers: [
            // { text: 'id', value: 'child_id', align: "center" },
            { text: 'الاسم', value: 'name', align: "center" },
            { text: 'العمر (بالاشهر)', value: 'age', align: "center" },
            { text: 'شدة الاصابة ', value: 'infection', align: "center" },
            { text: 'دراسة حالة', value: 'study_status', align: "center" },
            { text: 'اجراء اختبار', value: 'test', sortable: false, align: "center" },
            { text: 'تقرير', value: 'report', sortable: false, align: "center" },
            { text: 'ادارة', value: 'actions', sortable: false, align: "center" },

        ],
        search: '',
        data: [],
        load: false,
        dialogDelete: false,
        editedIndex: -1,
        delete: '',
        bread: [
            {
                text: 'الأطفال',
                disabled: true,
                href: '',
            },
            {
                text: 'عرض',
                disabled: false,
                href: '/child/list',
            },
        ],
        snackbar_delete: false,
        error_snackbar_delete: false,
        DialogReport: false,
        recomm: null,
        summary: null,
        child_id: null,
        user_id: '',
        filter: '',
        filter_list: [
            'طبيعي',
            'بسيط جداً',
            'بسيط',
            'متوسط',
            'شديدً',
            'شديد جداً'
        ]
    }),
    watch: {
        dialogDelete(val) {
            val || this.closeDelete()
        },
        filter(val) {
            this.load = false
            this.axios.get(this.$store.state.url + "/api/index_by_infection/" + val)
                .then(res => {
                    this.load = true
                    this.data = res.data
                    console.log(res.data)
                });
        }
    },
    methods: {
        getData() {
            this.axios.get(this.$store.state.url + "/api/child")
                .then(res => {
                    // console.log(res.data)
                    this.load = true
                    this.data = res.data
                    console.log(this.data)
                });
        },
        displayItem(item) {
            this.$router.replace({ name: 'display-child', params: { id: item.child_id } })
        },
        editItem(item) {
            // console.log("Edit: " + item.id)
            this.$router.replace({ name: 'edit-child', params: { id: item.child_id } })
        },
        deleteItem(item) {
            // console.log("Delete: " + item.id)
            this.editedIndex = this.data.indexOf(item)
            this.delete = item
            this.dialogDelete = true
        },
        deleteItemConfirm() {
            this.data.splice(this.editedIndex, 1)
            this.sendIdDeleted()
            this.closeDelete()
        },

        closeDelete() {
            this.dialogDelete = false
        },
        sendIdDeleted() {
            this.axios.delete(this.$store.state.url + "/api/child/" + this.delete.child_id)
                .then((res) => {
                    // console.log(res)
                    // console.log(this.delete.id)
                    if (res.status == 200)
                        this.snackbar_delete = true
                    else
                        this.error_snackbar_delete = true
                })
        },
        test(item) {
            console.log(item)
            const user_name = localStorage.getItem("name")
            const email = localStorage.getItem("email")

            const formData = new FormData()
            formData.append('father_name', item.father_name)
            formData.append('child_name', item.name)
            formData.append('age', item.birth_date)
            formData.append('user_name', user_name)
            formData.append('email', email)

            // console.log(user_name)
            // console.log(email)
            // window.location.replace('...');
            this.axios.post(this.$store.state.aca_url + "/api/connect/between/sys1", formData)
                .then(res => {
                    console.log(res.data)
                    if (res.data.message == "false") {
                        this.register(item)
                    }
                    if (res.data.message == "true")
                        window.location.replace(this.$store.state.aca_url_front + "/side-view-ass/" + res.data.data.id + "/" + res.data.data.user_id);
                }).catch(error => {
                    this.error_snackbar = true
                })
        },
        register(item) {
            const user_name = localStorage.getItem("name")
            const email = localStorage.getItem("email")

            this.axios.post(this.$store.state.aca_url + "/api/login_data", {
                "name": user_name,
                "email": email,
                "child_name": item.name,
                "father_name": item.father_name,
                "date": item.birth_date
            })
                .then(res => {
                    console.log(res)
                    this.user_id = res.data.user.id
                    window.location.replace(this.$store.state.aca_url_front + "/side-view-ass/" + res.data.child.id + "/" + this.user_id);

                })
        },
        study_status(item) {
            this.$router.replace({ name: 'child-study', params: { id: item.child_id } })
        },
        report(item) {
            this.DialogReport = true
            this.child_id = item.child_id
        },
        confrim_report() {
            // console.log(this.recomm)
            // console.log(this.summary)
            // this.axios.post(this.$store.state.url + "/api/Report/" + this.child_id,
            //     {
            //         recomm: this.recomm,
            //         summary: this.summary
            //     })
            //     .then(res => {
            //         console.log(res.data)
            //         this.$store.state.data_report = res.data
            //         console.log(this.$store.state.data_report)
            //     });
            this.$router.replace({ name: 'report-child', params: { id: this.child_id } })
        }
    },
    mounted() {
        this.getData()
    }
};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);

.list .card-header {
    display: flex;
    justify-content: space-between;
}
</style>
