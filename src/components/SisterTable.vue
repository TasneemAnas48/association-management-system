<template>
    <div>
        <v-data-table :headers="headers" :items="localSisterInfo" class="sister-table" hide-default-footer>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                إضافة
                            </v-btn>
                        </template>
                        <v-card class="sister-card">
                            <v-card-title>
                                <span class="text-h5" style="color: var(--v-primary-base)">{{ formTitle }}</span>
                            </v-card-title>
                            <v-divider class="mx-4" inset></v-divider>
                            <v-card-text>
                                <v-container>
                                    <v-text-field outlined :reverse="true" v-model="editedItem.name" label="الاسم"
                                        :error-messages="nameErrors" @input="$v.editedItem.name.$touch()"></v-text-field>

                                    <!-- <v-text-field outlined :reverse="true" v-model="editedItem.gender" label="الجنس"
                                        :error-messages="genderErrors"
                                        @input="$v.editedItem.gender.$touch()"></v-text-field> -->

                                    <v-text-field outlined :reverse="true" v-model="editedItem.age" label="العمر"
                                        :error-messages="ageErrors" @input="$v.editedItem.age.$touch()"></v-text-field>

                                    <v-text-field outlined :reverse="true" v-model="editedItem.Educ_level"
                                        label="المستوى التعليمي" :error-messages="Educ_levelErrors"
                                        @input="$v.editedItem.Educ_level.$touch()"></v-text-field>

                                    <div class="row" style="margin-right: 5px">
                                        <p style="font-size: 18px;">الجنس</p>
                                        <v-radio-group v-model="editedItem.gender" row :error-messages="genderErrors"
                                            @input="$v.editedItem.gender.$touch()">
                                            <v-radio label="انثى" value="انثى"></v-radio>
                                            <v-radio label="ذكر" value="ذكر"></v-radio>
                                        </v-radio-group>
                                    </div>
                                </v-container>
                            </v-card-text>
                            <v-card-actions class="sister-card-actions">
                                <v-btn color="blue darken-1" text @click="close">
                                    إلغاء
                                </v-btn>
                                <v-btn color="blue darken-1" text @click="save">
                                    حفظ
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="justify-content-center">هل انت متأكد من انك تريد الحذف</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">إلغاء</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">تأكيد</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <!-- <v-icon small @click="deleteItem(item)">
                    mdi-delete
                </v-icon> -->
            </template>
            <template v-slot:no-data>
                لايوجد بيانات
            </template>
        </v-data-table>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'

export default {
    name: 'SisterTable',
    props: ["title"],
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: 'الاسم', value: 'name', align: "center" },
            { text: 'الجنس', value: 'gender', align: "center" },
            { text: 'العمر', value: 'age', align: "center" },
            { text: 'المستوى التعليمي', value: 'Educ_level', align: "center" },
            { text: 'ادارة', value: 'actions', sortable: false, align: "center" },
        ],
        editedIndex: -1,
        editedItem: {
            name: '',
            gender: '',
            age: null,
            Educ_level: '',
        },
        defaultItem: {
            name: '',
            gender: '',
            age: null,
            Educ_level: '',
        },
        localSisterInfo: [],
        route: ''
    }),
    mixins: [validationMixin],
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'إضافة' : 'تعديل'
        },
        nameErrors() {
            const errors = []
            if (!this.$v.editedItem.name.$dirty) return errors
            !this.$v.editedItem.name.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        genderErrors() {
            const errors = []
            if (!this.$v.editedItem.gender.$dirty) return errors
            !this.$v.editedItem.gender.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        ageErrors() {
            const errors = []
            if (!this.$v.editedItem.age.$dirty) return errors
            !this.$v.editedItem.age.required && errors.push('هذا الحقل مطلوب')
            !this.$v.editedItem.age.numeric && errors.push('الرجاء ادخال العمر كرقم')
            return errors
        },
        Educ_levelErrors() {
            const errors = []
            if (!this.$v.editedItem.Educ_level.$dirty) return errors
            !this.$v.editedItem.Educ_level.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
    },
    validations: {
        editedItem: {
            name: { required },
            gender: { required },
            age: { required, numeric },
            Educ_level: { required }
        }
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    mounted() {
        if (this.$route.name == "edit-child") {
            this.id = this.$route.params.id
            if (!this.localDate) {
                this.axios.get(this.$store.state.url + "/api/child/show/" + this.id)
                    .then(res => {
                        this.localSisterInfo = res.data.data[0].family
                    })
            }
        }
    },

    methods: {
        editItem(item) {
            this.editedIndex = this.localSisterInfo.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.localSisterInfo.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.localSisterInfo.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            this.$emit('table', this.localSisterInfo);
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            this.$emit('table', this.localSisterInfo);
        },

        save() {
            this.$v.$touch()
            if (!this.$v.$error) {
                if (this.editedIndex > -1) {
                    Object.assign(this.localSisterInfo[this.editedIndex], this.editedItem)
                } else {
                    this.localSisterInfo.push(this.editedItem)
                }
                this.close()
            }
        },
    },
};
</script>

<style lang="scss">
.sister-table.v-data-table {
    border: 1px solid #808080c2;
    border-radius: 20px;
    padding-bottom: 20px;
    margin-bottom: 50px;
}

.sister-table .v-toolbar--flat {
    background: transparent !important;
}

.sister-table .v-toolbar__title {
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px;
}

.sister-table .mdi-pencil {
    font-size: 16px;
    color: #109610;
    border: 1px solid #109610;
    border-radius: 5px;
    padding: 3px;
    margin-left: 10px;
}

.sister-table .mdi-pencil:hover {
    color: #fff;
    background-color: #109610;
}

.sister-table .mdi-delete {
    font-size: 16px;
    color: rgb(201, 9, 9);
    border: 1px solid rgb(201, 9, 9);
    border-radius: 5px;
    padding: 3px;
}

.sister-table .mdi-delete:hover {
    color: #fff;
    background-color: rgb(201, 9, 9);
}

.sister-card-actions {
    top: -50px;
    position: inherit;
    justify-content: end;
}

.sister-card .v-messages__message {
    text-align: justify;
}

.sister-card .v-divider {
    margin-top: 0px !important;
    margin-bottom: 0px !important
}
</style>
