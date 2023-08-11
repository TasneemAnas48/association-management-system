<template>
    <div id="list-appointment" class="list-appointment list">
        <breadcrumbs :breadcrumbs="bread" />
        <div class="card">
            <div class="card-header">
                عرض المهمات
                <router-link to="/appointment/add">
                    <v-btn color="primary" outlined>
                        إضافة مهمة
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <div v-if="load">
                    <v-card-title>
                        <div class="row">
                            <div class="col-lg-5">
                                <v-text-field :reverse="true" v-model="search" append-icon="mdi-magnify" label="ابحث"
                                    single-line hide-details></v-text-field>
                            </div>
                            <div class="col-lg-2"></div>
                            <div class="col-lg-5">
                                <v-select class="filter" v-model="filter" :reverse="true" :items="filter_list" single-line
                                    hide-details append-icon="mdi-filter" label="فلترة حسب"></v-select>
                            </div>
                        </div>

                    </v-card-title>
                    <v-data-table :headers="headers" :items="filterData" :search="search" class="my-table">
                        <template v-slot:top>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card v-if="check == 0">
                                    <v-spacer></v-spacer>
                                    <v-card-title class="justify-content-center" style="padding-top: 30px">
                                        هل انت متأكد من انك تريد حذف المهمة
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
                                <v-card v-if="check == 1">
                                    <v-spacer></v-spacer>
                                    <v-card-title class="justify-content-center" style="padding-top: 30px">
                                        لايمكنك حذف المهمة لانه قد تم انهاؤها
                                    </v-card-title>
                                    <v-card-actions style="padding-bottom: 30px">
                                        <v-spacer></v-spacer>
                                        <v-btn color="gray" text @click="closeDelete">إلغاء
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <div class="row justify-content-center">
                                <div @click="deleteItem(item)">
                                    <i class="fa fa-trash"></i>
                                </div>
                            </div>
                        </template>
                        <template v-slot:[`item.check`]="{ item }">
                            <div class="row justify-content-center">
                                <div v-if="item.check == 0">
                                    لم يتم انهاء المهمة
                                </div>
                                <div v-if="item.check == 1">
                                    تم انهاء المهمة
                                </div>
                            </div>
                        </template>
                    </v-data-table>
                </div>
                <div class="progress-container" v-else>
                    <v-progress-circular indeterminate color="primary" :size="50"
                        style="margin-top: 100px"></v-progress-circular>
                </div>
                <v-snackbar right bottom color="green" text v-model="snackbar_delete" timeout="5000">
                    تم حذف المهمة بنجاح
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
        </div>
    </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"

export default {
    name: 'appointmentList',
    components: {
        Breadcrumbs
    },
    data: () => ({
        headers: [
            { text: 'رقم المهمة', value: 'id', align: "center" },
            { text: 'اسم الطفل', value: 'child_name', align: "center" },
            { text: 'تاريخ المهمة', value: 'app_date', align: "center" },
            { text: 'اسم الموظف', value: 'user_name', align: "center" },
            { text: ' الحالة', value: 'check', align: "center" },
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
                text: 'المهمات',
                disabled: true,
                href: '',
            },
            {
                text: 'عرض',
                disabled: false,
                href: '/appointment/list',
            },
        ],
        snackbar_delete: false,
        error_snackbar_delete: false,
        check: null,
        filter: '',
        filter_list: [
            'جميع المهمات',
            'المهمات غير المنتهية',
            'المهمات المنتهية'
        ]
    }),
    watch: {
        dialogDelete(val) {
            val || this.closeDelete()
        }
    },
    computed: {
        filterData() {
            if (this.filter == 'جميع المهمات')
                return this.data
            else if (this.filter == 'المهمات غير المنتهية')
                return this.data.filter(item => item.check == 0)
            else if (this.filter == 'المهمات المنتهية')
                return this.data.filter(item => item.check == 1)
            else
                return this.data
        },
    },
    methods: {
        getData() {
            const token = localStorage.getItem("token")
            this.axios.get(this.$store.state.url + "/api/Show_appointment", { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.load = true
                    this.data = res.data.Appointment
                    console.log(res.data.Appointment)
                });
        },
        deleteItem(item) {
            console.log("Delete: " + item.id)
            this.editedIndex = this.data.indexOf(item)
            this.delete = item
            this.check = item.check
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
            this.axios.post(this.$store.state.url + "/api/delete_appointment/" + this.delete.id)
                .then((res) => {
                    console.log(res.data)
                    if (res.data.message == 'this appointment has deleted')
                        this.snackbar_delete = true
                    else
                        this.error_snackbar_delete = true
                    // console.log(this.delete.id)
                })
        },
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
