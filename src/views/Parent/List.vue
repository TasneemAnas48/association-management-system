<template>
    <div id="list-specialist" class="list-specialist list">
        <breadcrumbs :breadcrumbs="bread" />
        <div class="card">
            <div class="card-header">
                عرض الرسائل
                <router-link to="/parent/message/add">
                    <v-btn color="primary" outlined>
                        إضافة رسالة
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
    name: 'specialistList',
    components: {
        Breadcrumbs
    },
    data: () => ({
        headers: [
            { text: 'id', value: 'id', align: "center" },
            { text: 'الطفل', value: 'child_name', align: "center" },
            { text: 'الرسالة  ', value: 'text', align: "center" },
        ],
        search: '',
        data: [],
        load: false,
        bread: [
            {
                text: 'الأهل',
                disabled: true,
                href: '',
            },
            {
                text: 'عرض الرسائل',
                disabled: false,
                href: '/parent/message/list',
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
            this.axios.get(this.$store.state.url + "/api/advice")
                .then(res => {
                    this.load = true
                    this.data = res.data.data
                    console.log(this.data)
                });
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
