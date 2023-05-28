<template>
    <div id="list-child" class="list-child list">
        <breadcrumbs :breadcrumbs="bread" />
        <div class="card">
            <div class="tab-container">
                <v-tabs v-model="tab" color="secondary">
                    <v-tab class="custom-tab" key="per">
                        معلومات شخصية
                    </v-tab>
                    <v-tab class="custom-tab" key="med">
                        المجال الطبي
                    </v-tab>
                    <v-tab class="custom-tab" key="edu">
                        المجال التربوي
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab" color="secondary">
                    <v-tab-item key="per">
                        <per />
                    </v-tab-item>
                    <v-tab-item key="med">
                        <med/>
                    </v-tab-item>
                    <v-tab-item key="edu">
                        <edu/>
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </div>
    </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import per from "@/components/Display Child/per.vue"
import med from "@/components/Display Child/med.vue"
import edu from "@/components/Display Child/edu.vue"
export default {
    name: 'DisplayChilde',
    components: {
        Breadcrumbs,
        per,
        med,
        edu
    },
    data: () => ({
        id: null,
        params: '',
        load: false,
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
            {
                text: 'طفل معين',
                disabled: true,
                href: '',
            },
        ],
        tab: null,
    }),
    methods: {
        
    },
    mounted() {
        this.route = this.$route.name
        this.id = this.$route.params.id
        // this.ifDone()
        // this.getData()
        // this.getMed()
        // this.getEdu()
    }
};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);

.list-child .tab-container {
    margin: 30px;
}

.list-child .custom-tab {
    font-size: 20px;
}

.v-slide-group__content {
    border-bottom: 1px solid rgb(187, 187, 187)
}
</style>
