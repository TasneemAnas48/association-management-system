<template>
    <div id="list-employee" class="list-employee list">
        <breadcrumbs :breadcrumbs="bread" />
        <div class="card">
            <div class="card-header">
                عرض الموظفين
                <router-link to="/employee/add">
                    <v-btn color="primary" outlined>
                        إضافة موظف
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <div v-if="load">
                    <v-card-title>
                        <v-text-field :reverse="true" v-model="search" append-icon="mdi-magnify" label="ابحث" single-line
                            hide-details></v-text-field>
                        <v-spacer></v-spacer><v-spacer></v-spacer><v-spacer></v-spacer>
                    </v-card-title>
                    <v-data-table :headers="headers" :items="data" :search="search" class="my-table">
                        <template v-slot:top>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card>
                                    <v-spacer></v-spacer>
                                    <v-card-title class="justify-content-center" style="padding-top: 30px">
                                        هل انت متأكد من انك تريد حذف الموظف
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
                                <div @click="deleteItem(item)">
                                    <i class="fa fa-trash"></i>
                                </div>
                            </div>
                        </template>
                        <template v-slot:[`item.display`]="{ item }">
                            <div class="row justify-content-center">
                                <div @click="display(item)">
                                    <i class="fa fa-eye"></i>
                                </div>
                            </div>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="dialogTask" max-width="700px" persistent>
                        <v-card v-if="load_task">
                            <v-spacer></v-spacer>
                            <v-card-title class="justify-content-start"
                                style="border-bottom: 1px solid #aeaeae;padding-top: 30px;font-weight: bold;margin-bottom: 40px;">
                                مهمات الموظف
                            </v-card-title>
                            <div v-if="tasks.length != 0">
                                <v-simple-table v-for="(task, index) in tasks" :key="index"
                                    style="margin: 10px 30px 30px; padding: 0px;">
                                    <template v-slot:default>
                                        <tbody>
                                            <tr>
                                                <td>اسم الطفل</td>
                                                <td>{{ task.child_name }}</td>
                                            </tr>
                                            <tr>
                                                <td> تاريخ المهمة</td>
                                                <td>{{ task.date_task }}</td>
                                            </tr>
                                            <tr>
                                                <td>عنوان المهمة</td>
                                                <td>{{ task.title }}</td>
                                            </tr>
                                            <tr>
                                                <td>تفاصيل المهمة</td>
                                                <td>{{ task.description }}</td>
                                            </tr>
                                            <tr>
                                                <td> عدد ساعات انجاز المهمة</td>
                                                <td>{{ task.hours }}</td>
                                            </tr>
                                            <tr>
                                                <td> انجاز المهمة</td>
                                                <td v-if="task.check == 0">لم يتم الانجاز</td>
                                                <td v-if="task.check == 1"> تم الانجاز</td>
                                            </tr>
                                            <tr v-if="task.notes != null">
                                                <td> ملاحظات الموظف </td>
                                                <td>{{ task.notes }}</td>
                                            </tr>
                                            <tr v-if="task.points != null">
                                                <td> النقاط </td>
                                                <td>{{ task.points }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </div>
                            <div class="no-task" v-else>
                                لايوجد مهمات حاليا
                            </div>
                            <v-card-actions style="justify-content: end; padding-bottom: 30px;margin-left: 20px;">
                                <v-btn color="primary" @click="close_dialog()">اغلاق
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-card class="progress-container" v-else>
                            <v-progress-circular indeterminate color="primary" :size="50"
                                style="margin-top: 100px;margin-bottom: 100px"></v-progress-circular>
                        </v-card>
                    </v-dialog>
                </div>
                <div class="progress-container" v-else>
                    <v-progress-circular indeterminate color="primary" :size="50"
                        style="margin-top: 100px"></v-progress-circular>
                </div>
                <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000">
                    تم حذف الموظف بنجاح
                    <template v-slot:action="{ attrs }">
                        <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
                            اغلاق
                        </v-btn>
                    </template>
                </v-snackbar>
                <v-snackbar right bottom color="red" text v-model="error_snackbar" timeout="5000">
                    حدث خطأ غير متوقع، الرجاء اعادة المحاولة
                    <template v-slot:action="{ attrs }">
                        <v-btn color="red" text v-bind="attrs" @click="error_snackbar = false">
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
    name: 'employeeList',
    components: {
        Breadcrumbs
    },
    data: () => ({
        headers: [
            { text: 'الاسم', value: 'name', align: "center" },
            { text: 'البريد الالكتروني ', value: 'email', align: "center" },
            { text: ' المستوى العلمي  ', value: 'scientific_level', align: "center" },
            { text: 'عدد المهمات', value: 'count', align: "center" },
            { text: 'النقاط', value: 'points', align: "center" },
            { text: ' عرض المهمات ', value: 'display', align: "center" },
            { text: 'ادارة', value: 'actions', sortable: false, align: "center" },
        ],
        snackbar: false,
        error_snackbar: false,
        search: '',
        data: [],
        load: false,
        dialogDelete: false,
        editedIndex: -1,
        delete: '',
        bread: [
            {
                text: 'الموظفين',
                disabled: true,
                href: '',
            },
            {
                text: 'عرض',
                disabled: false,
                href: '/employee/list',
            },
        ],
        tasks: [],
        dialogTask: false,
        load_task: false,
    }),
    watch: {
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    methods: {
        getData() {
            const token = localStorage.getItem("token")
            this.axios.get(this.$store.state.url + "/api/show_Employee", { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.load = true
                    this.data = res.data.data
                    console.log(res.data)
                });
        },
        deleteItem(item) {
            console.log("Delete: " + item.emp_id)
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
            this.axios.delete(this.$store.state.url + "/api/delete_SpecOrEmp/" + this.delete.emp_id)
                .then((res) => {
                    console.log(res.data)
                    console.log(this.delete.emp_id)
                    if (res.data.message == 'This user has been deleted successfully')
                        this.snackbar = true
                    else
                        this.error_snackbar = true
                })
        },
        display(item) {
            this.dialogTask = true
            console.log(item.emp_id)
            const token = localStorage.getItem("token")
            this.axios.get(this.$store.state.url + "/api/show_MyTasks_id/" + item.emp_id, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.load_task = true
                    this.tasks = res.data.Task
                    console.log(this.tasks)
                });
        },
        close_dialog() {
            this.dialogTask = false
            this.load_task = false
            this.tasks = []
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

.task {
    margin: 25px 50px;
}

.no-task {
    display: flex;
    justify-content: center;
    font-size: 20px;
    border-bottom: 1px solid #aeaeae;
    padding-bottom: 50px;
    margin-bottom: 20px;
}
</style>
