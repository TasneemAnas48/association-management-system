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
                        <template v-slot:[`item.infection`]="{ item }">
                            <div v-if="item.infection == null">
                                لم تتم دراسة الحالة
                            </div>
                        </template>
                        <template v-slot:[`item.study_status`]="{ item }">
                            <div @click="study_status(item)">
                                <i class="fas fa-edit"></i>
                            </div>
                        </template>
                    </v-data-table>
                </div>
                <div class="progress-container" v-else>
                    <v-progress-circular indeterminate color="primary" :size="50"
                        style="margin-top: 100px"></v-progress-circular>
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
            { text: 'id', value: 'id', align: "center" },
            { text: 'الاسم', value: 'name', align: "center" },
            { text: 'العمر', value: 'age', align: "center" },
            { text: 'رقم الهاتف', value: 'phone_num', align: "center" },
            { text: 'الحالة', value: 'infection', align: "center" },
            { text: 'دراسة حالة', value: 'study_status', align: "center" },
            // { text: 'القسم', value: 'section', align: "center" },
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
    }),
    watch: {
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    methods: {
        getData() {
            this.axios.get(this.$store.state.url + "/api/child")
                .then(res => {
                    console.log(res.data)
                    this.load = true
                    this.data = res.data
                    console.log(this.data)
                });
        },
        displayItem(item) {
            this.$router.replace({ name: 'display-child', params: { id: item.id } })
        },
        editItem(item) {
            console.log("Edit: " + item.id)
            this.$router.replace({ name: 'edit-child', params: { id: item.id } })
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
            this.axios.delete(this.$store.state.url + "/api/child/"+ this.delete.id )
                .then((res) => {
                    console.log(res)
                    console.log(this.delete.id)
                    if (res.status == 200 )
                        this.snackbar_delete = true
                    else
                        this.error_snackbar_delete = true
                })
        },
        study_status(item){
            this.$router.replace({ name: 'child-study', params: { id: item.id } })
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
