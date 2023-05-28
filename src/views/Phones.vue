<template>
    <div id="list-phones" class="list-phones list">
        <breadcrumbs :breadcrumbs="bread" />
        <div class="card">
            <div class="card-header">
                عرض دليل الهاتف
            
            </div>
            <div class="card-body">
                <div v-if="load">
                    <v-card-title>
                        <v-text-field :reverse="true" v-model="search" append-icon="mdi-magnify" label="ابحث" single-line
                            hide-details></v-text-field>
                        <v-spacer></v-spacer><v-spacer></v-spacer><v-spacer></v-spacer>
                    </v-card-title>
                    <v-data-table :headers="headers" :items="data" :search="search" class="my-table">
                    </v-data-table>
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

export default {
    name: 'Phones',
    components: {
        Breadcrumbs
    },
    data: () => ({
        headers: [
            { text: 'اسم الطفل', value: 'name', align: "center" },
            { text: 'رقم الهاتف', value: 'number', align: "center" },
        ],
        search: '',
        data: [],
        load: false,
        dialogDelete: false,
        editedIndex: -1,
        delete: '',
        bread: [
            {
                text: 'دليل الهاتف',
                disabled: true,
                href: '',
            },
            {
                text: 'عرض',
                disabled: false,
                href: '/phones/list',
            },
        ],
    }),
    methods: {
        getData() {
            const token = localStorage.getItem("token")
            this.axios.get(this.$store.state.url + "/api/Show_Phones",  { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    this.load = true
                    this.data = res.data.phones
                    console.log(res.data.phones)
                });
        },
    },
    mounted() {
        this.getData()
    }
};
</script>

<style lang="scss">
@import url(../assets/Css/main.css);

.list .card-header {
    display: flex;
    justify-content: space-between;
}
</style>
