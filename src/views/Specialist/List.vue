<template>
    <div id="list-specialist" class="list-specialist list">
        <breadcrumbs :breadcrumbs="bread" />
        <div class="card">
            <div class="card-header">
                عرض الاخصائيين
                <router-link to="/specialist/add">
                    <v-btn color="primary" outlined>
                        إضافة اخصائي
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
                                        هل انت متأكد من انك تريد حذف الاخصائي
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
                    </v-data-table>
                </div>
                <div class="progress-container" v-else>
                    <v-progress-circular indeterminate color="primary" :size="50"
                        style="margin-top: 100px"></v-progress-circular>
                </div>
                <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000">
                    تم حذف الاخصائي بنجاح
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
    name: 'specialistList',
    components: {
        Breadcrumbs
    },
    data: () => ({
        headers: [
            { text: 'id', value: 'id', align: "center" },
            { text: 'الاسم', value: 'name', align: "center" },
            { text: 'البريد الالكتروني ', value: 'email', align: "center" },
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
                text: 'الاخصائيين',
                disabled: true,
                href: '',
            },
            {
                text: 'عرض',
                disabled: false,
                href: '/specialist/list',
            },
        ],
    }),
    watch: {
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    methods: {
        getData() {
            const token = localStorage.getItem("token")
            this.axios.get(this.$store.state.url + "/api/show_Specialist", { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.load = true
                    this.data = res.data
                    console.log(this.data)
                });
        },
        deleteItem(item) {
            console.log("Delete: " + item.id)
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
            this.axios.delete(this.$store.state.url + "/api/delete_SpecOrEmp/" + this.delete.id)
                .then((res) => {
                    console.log(res.data)
                    console.log(this.delete.id)
                    if (res.data.message == 'This user has been deleted successfully')
                        this.snackbar = true
                    else
                        this.error_snackbar = true
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
