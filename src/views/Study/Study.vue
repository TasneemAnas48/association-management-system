<template>
    <div id="study" class="study add">
        <breadcrumbs :breadcrumbs="bread" />
        <div class="card">
            <div class="card-header" style="display: flex;justify-content: space-between;">
                دراسة حالة {{ toggle }}
                <v-btn-toggle v-model="toggle" group color="secondary accent-3">
                    <v-btn value="المجال الطبي">
                        المجال الطبي
                    </v-btn>
                    <v-btn value="المجال التربوي">
                        المجال التربوي
                    </v-btn>
                </v-btn-toggle>
            </div>
            <div class="card-body">
                <div v-if="toggle == 'المجال الطبي' && medical == 'done'">
                    <div class="no-form">
                        <img src="@/assets/img/check.svg" style="width: 35%" />
                        <p class="text">
                            لقد قمت بدراسة حالة المجال الطبي سابقاً
                        </p>
                    </div>
                </div>
                <div v-if="toggle == 'المجال الطبي' && medical == 'not'">
                    <med />
                </div>
                <div v-if="toggle == 'المجال التربوي' && education == 'done'">
                    <div class="no-form">
                        <img src="@/assets/img/check.svg" style="width: 35%" />
                        <p class="text">
                            لقد قمت بدراسة حالة المجال التربوي سابقاً
                        </p>
                    </div>
                </div>
                <div v-if="toggle == 'المجال التربوي' && education == 'not'">
                    <edu />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import med from "@/components/med.vue"
import edu from "@/components/edu.vue"
export default {
    name: 'Phones',
    components: {
        Breadcrumbs,
        med,
        edu
    },
    data: () => ({
        bread: [
            {
                text: ' الاطفال',
                disabled: true,
                href: '',
            },
            {
                text: ' عرض',
                disabled: false,
                href: '/child/list',
            },
            {
                text: 'دراسة حالة',
                disabled: true,
                href: '',
            },
        ],
        toggle: "المجال الطبي",
        child_id: null,
        education: null,
        medical: null
    }),
    watch: {
        toggle() {
            console.log(this.toggle)
        }
    },
    methods: {
        ifDone() {
            this.axios.post(this.$store.state.url + "/api/done_Education_Medical", { id: this.child_id })
                .then(res => {
                    console.log(res.data)
                    this.education = res.data.education
                    this.medical = res.data.medical
                });
        }
    },
    mounted() {
        this.child_id = this.$route.params.id
        this.ifDone()
    }
};
</script>

<style lang="scss">
@import url(@/assets/Css/main.css);

.study .no-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 25px;
}

.study .text {
    font-size: 20px;
    font-weight: bold;
}
</style>
