<template>
    <div id="parent" class="parent add">
        <breadcrumbs :breadcrumbs="bread_add" />
        <div class="card">
            <div class="card-header">
                تواصل مع الأهل
                <router-link to="/parent/message/list">
                    <v-btn color="primary" outlined>
                        عرض الرسائل
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <div class="row" style="align-items: center;">
                    <div class="col-lg-6">
                        <v-form>
                            <v-select outlined v-model="child_id" :reverse="true" :items="child_list" item-text="name"
                                item-value="id" label=" الطفل" :error-messages="childErrors"
                                @input="$v.child_id.$touch()"></v-select>


                            <v-textarea outlined :reverse="true" label="نصائح وتوجيهات للأهل" v-model="message" :error-messages="messageErrors"  @input="$v.message.$touch()"
                                value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."></v-textarea>


                            <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light
                                style="margin-top: 15px">
                                إرسال
                                <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                                    color="white"></v-progress-circular>
                            </v-btn>
                            <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000">
                                تم إرسال الرسالة بنجاح
                                <template v-slot:action="{ attrs }">
                                    <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
                                        اغلاق
                                    </v-btn>
                                </template>
                            </v-snackbar>
                            <v-snackbar right bottom color="red" text v-model="error_snackbar" timeout="5000">
                                حدث خطأ غير متوقع، الرجاء إعادة المحاولة
                                <template v-slot:action="{ attrs }">
                                    <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
                                        اغلاق
                                    </v-btn>
                                </template>
                            </v-snackbar>
                        </v-form>
                    </div>
                    <div class="col-lg-6" style="display: flex;justify-content: center;">
                        <img src="@/assets/img/family.svg" style="width: 70%" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
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
        bread_add: [
            {
                text: 'الأهل',
                disabled: true,
                href: '',
            },
            {
                text: 'إرسال رسالة',
                disabled: false,
                href: '/parent/message/add',
            },
        ],
        message: '',
        child_list: [],
        child_id: '',
    }),
    validations: {
        message: { required },
        child_id: { required },
    },
    computed: {
        messageErrors() {
            const errors = []
            if (!this.$v.message.$dirty) return errors
            !this.$v.message.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        childErrors() {
            const errors = []
            if (!this.$v.child_id.$dirty) return errors
            !this.$v.child_id.required && errors.push('هذا الحقل مطلوب')
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
            formData.append('child_id', this.child_id)
            formData.append('text', this.message)
            this.axios.post(this.$store.state.url + "/api/advice", formData)
                .then(res => {
                    this.response = true
                    console.log(res.data)
                    if (res.data.message == "success in add advice..") {
                        this.$router.replace({ name: 'parent-list' })

                    }
                    else
                        this.error_snackbar = true
                });
        },
        getChild() {
            this.axios.get(this.$store.state.url + "/api/childs/names")
                .then(res => {
                    this.child_list = res.data.data
                    console.log(res.data.data)
                });
        },
    },
    mounted() {
        this.getChild()
    }
};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);
.parent .v-text-field__slot {
    right: 12px;
}
</style>
