<template>
    <div id="add-child" class="add-child add">
        <breadcrumbs :breadcrumbs="bread_add" v-if="this.route == 'add-child'" />
        <breadcrumbs :breadcrumbs="bread_edit" v-if="this.route == 'edit-child'" />
        <div class="card">
            <div class="card-header" v-if="this.route == 'add-child'">
                إضافة طفل
                <router-link to="/child/list">
                    <v-btn color="primary" outlined>
                        عرض الأطفال
                    </v-btn>
                </router-link>
            </div>
            <div class="card-header" v-else-if="this.route == 'edit-child'">
                تعديل طفل
                <router-link to="/child/list">
                    <v-btn color="primary">
                        عرض الأطفال
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <v-form v-if="load">
                    <div class="box">
                        <h6 class="box-title">معلومات عامة عن الطفل</h6>
                        <div v-for="(ques, index) in personal_ques" :key="index">
                            <v-text-field
                                v-if="ques.type == 0 && ques.ques_id != 1 && ques.ques_id != 4 && ques.ques_id != 3 && ques.ques_id != 11 && ques.ques_id != 8 && ques.ques_id != 6"
                                outlined :reverse="true" v-model="my_answer[index].answer"
                                :label="ques.question"></v-text-field>
                            <v-text-field v-if="ques.ques_id == 1" outlined :reverse="true" v-model="name"
                                :label="ques.question"></v-text-field>
                            <v-text-field v-if="ques.ques_id == 8" outlined :reverse="true" v-model="phone_number"
                                :label="ques.question"></v-text-field>

                            <div class="row" style="margin-right: 5px" v-if="ques.ques_id == 6">
                                <p style="font-size: 18px;">{{ ques.question }}</p>
                                <v-radio-group v-model="gender" row>
                                    <v-radio label="انثى" value="انثى"></v-radio>
                                    <v-radio label="ذكر" value="ذكر"></v-radio>
                                </v-radio-group>
                            </div>

                            <my-date v-if="ques.ques_id == 3" :ques="ques.question" :date="my_answer[index].answer"
                                @date="my_answer[index].answer = $event"></my-date>
                            <my-date v-if="ques.ques_id == 4" :ques="ques.question" @date="age = $event"
                                :date="my_answer[index].answer"></my-date>
                            <my-date v-if="ques.ques_id == 11" :ques="ques.question" :date="my_answer[index].answer"
                                @date="my_answer[index].answer = $event"></my-date>
                            <div class="row" style="margin-right: 5px" v-if="ques.type == 1">
                                <p style="font-size: 18px;">{{ ques.question }}</p>
                                <v-radio-group v-model="my_answer[index].answer" row>
                                    <v-radio label="نعم" value="نعم"></v-radio>
                                    <v-radio label="لا" value="لا"></v-radio>
                                </v-radio-group>
                            </div>
                        </div>
                        <v-snackbar right bottom color="red" text v-model="error_snackbar" timeout="30000">
                            <ul style="padding: 22px;">
                                <li v-for="(error, j) in my_error" :key="j">
                                    {{ error }}
                                </li>
                            </ul>
                        </v-snackbar>
                        <v-snackbar right bottom color="red" text v-model="error_snackbar" timeout="30000">
                            <ul style=" padding: 0px 20px;">
                                <li v-for="(error, i) in back_error" :key="i">
                                    {{ error }}
                                </li>
                            </ul>
                        </v-snackbar>
                        <v-snackbar right bottom color="red" text v-model="error_snackbar2" timeout="3000">
                            يجب ادخال عدد اخوة مطابق لما تم ادخاله في جدول الاخوات
                        </v-snackbar>
                    </div>
                    <div class="box">
                        <h6 class="box-title">معلومات عامة عن العائلة</h6>
                        <div v-for="(ques, index) in family_ques" :key="index">
                            <v-text-field v-if="ques.type == 0 && ques.ques_id != 32" outlined :reverse="true" required
                                v-model="my_answer[personal_length + index].answer" :label="ques.question"></v-text-field>
                            <sister-table v-if="ques.ques_id == 32" :title="ques.question" @table="sister_info = $event" />
                            <div class="row" style="margin-right: 5px" v-if="ques.type == 1">
                                <p style="font-size: 18px;">{{ ques.question }}</p>
                                <v-radio-group v-model="my_answer[personal_length + index].answer" row>
                                    <v-radio label="نعم" value="نعم"></v-radio>
                                    <v-radio label="لا" value="لا"></v-radio>
                                </v-radio-group>
                            </div>
                        </div>
                    </div>
                    <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light style="margin-top: 15px">
                        حفظ
                        <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                            color="white"></v-progress-circular>
                    </v-btn>
                    <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000"
                        v-if="this.route == 'add-child'">
                        تم إضافة الطفل بنجاح
                        <template v-slot:action="{ attrs }">
                            <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
                                اغلاق
                            </v-btn>
                        </template>
                    </v-snackbar>
                    <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000"
                        v-else-if="this.route == 'edit-child'">
                        تم تعديل معلومات الطفل بنجاح
                        <template v-slot:action="{ attrs }">
                            <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
                                اغلاق
                            </v-btn>
                        </template>
                    </v-snackbar>
                </v-form>
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
import MyDate from "@/components/MyDate.vue"
import SisterTable from '@/components/SisterTable.vue'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
export default {
    name: 'Addchild',
    components: {
        Breadcrumbs,
        MyDate,
        SisterTable
    },
    mixins: [validationMixin],
    data: () => ({
        load: false,
        response: false,
        isSubmit: false,
        snackbar: false,
        error_snackbar: false,
        error_snackbar2: false,
        date: null,
        bread_add: [
            {
                text: 'الأطفال',
                disabled: true,
                href: '',
            },
            {
                text: 'إضافة',
                disabled: false,
                href: '/child/add',
            },
        ],
        bread_edit: [
            {
                text: 'الأطفال',
                disabled: true,
                href: '',
            },
            {
                text: 'تعديل',
                disabled: true,
                href: '',
            },
        ],
        edit: false,
        route: '',
        child_id: '',
        question: [],
        my_answer: [],
        personal_ques: [],
        family_ques: [],
        personal_length: null,
        name: '',
        age: null,
        phone_number: '',
        send_answer: [],
        sister_info: [],
        gender: null,
        id: null,
        back_error: [],
        my_error:[]
    }),
    validations: {
        name: { required },
        age: { required },
        phone_number: { required, minLength: minLength(10), maxLength: maxLength(10), numeric },
        gender: { required },
    },
    computed: {
        
    },
    methods: {
        Errors() {
            this.$v.$touch()
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.required && errors.push('الرجاء ادخال اسم الطالب')
            if (!this.$v.age.$dirty) return errors
            !this.$v.age.required && errors.push('الرجاء ادخال تاريخ الميلاد ')
            if (!this.$v.gender.$dirty) return errors
            !this.$v.gender.required && errors.push('الرجاء ادخال الجنس')
            if (!this.$v.phone_number.$dirty) return errors
            !this.$v.phone_number.minLength && errors.push('الرجاء ادخال رقم هاتف صحيح مكون من 10 ارقام')
            !this.$v.phone_number.maxLength && errors.push('الرجاء ادخال رقم هاتف صحيح مكون من 10 ارقام')
            !this.$v.phone_number.required && errors.push('الرجاء ادخال رقم الهاتف')
            !this.$v.phone_number.numeric && errors.push('الرجاء ادخال رقم هاتف صحيح مكون من 10 ارقام')
            this.my_error = errors.reverse()
            // return errors.reverse()
        },
        getQuestion() {
            this.axios.get(this.$store.state.url + "/api/personal_question/all")
                .then(res => {
                    this.question = res.data.data
                    this.load = true
                    this.question.forEach(item => {
                        this.my_answer.push({
                            ques_id: item.ques_id,
                            answer: '',
                        });
                        if (item.title_id == 11)
                            this.personal_ques.push(item);
                        else if (item.title_id == 10)
                            this.family_ques.push(item);
                    })
                    this.personal_length = this.personal_ques.length
                    // console.log(this.question)
                })
        },
        submit() {
            this.Errors()
            this.error_snackbar = false
            this.error_snackbar2 = false
            this.my_answer.forEach(item => {
                if (item.ques_id == 30) {
                    if (item.answer != this.sister_info.length)
                        this.error_snackbar2 = true
                }
            })
            // console.log(this.my_error)
            if (this.$v.$error){
                this.error_snackbar = true
                console.log(this.my_error)
            }
            else if (!this.$v.$error && !this.error_snackbar2) {
                this.isSubmit = true
                if (this.$route.name == "add-child") {
                    let dateStr = this.age;
                    let parts = dateStr.split('-');
                    this.age = parts.reverse().join('/');
                    this.my_answer.forEach(item => {
                        if (item.ques_id == 3) {
                            let dateStr3 = item.answer;
                            let parts3 = dateStr3.split('-');
                            item.answer = parts3.reverse().join('/');
                            console.log("3")
                            console.log(item.answer)
                        }
                        if (item.ques_id == 11) {
                            let dateStr11 = item.answer;
                            let parts11 = dateStr11.split('-');
                            item.answer = parts11.reverse().join('/');
                            console.log("11")
                            console.log(item.answer)
                        }
                        if (item.ques_id != 1 && item.ques_id != 8 && item.answer != '') {
                            this.send_answer.push(item)
                        }
                        if (item.ques_id == 4)
                            this.send_answer.push({
                                ques_id: 4,
                                answer: this.age,
                            });
                        if (item.ques_id == 6)
                            this.send_answer.push({
                                ques_id: 6,
                                answer: this.gender,
                            });
                    })
                    this.sendData_2()
                }
                else {
                    this.editData()
                }
            }
        },
        sendData_1() {
            const formData = new FormData()
            let dateStr = this.age;
            let parts = dateStr.split('-');
            this.age = parts.reverse().join('/');
            formData.append('name', this.name)
            formData.append('age', this.age)
            formData.append('phone_number', this.phone_number)

            console.log("____________________________________")
            console.log(this.name)
            console.log(this.age)
            console.log(this.phone_number)
            console.log("____________________________________")
            this.axios.post(this.$store.state.url + "/api/child", formData)
                .then(res => {
                    console.log(res)
                    if (res.data.status == "success") {
                        this.child_id = res.data.data.id
                        console.log(this.child_id)
                        this.sendData_2()
                    }
                });
            this.sendData_2()
        },
        sendData_2() {
            // let dateStr = this.age;
            // let parts = dateStr.split('-');
            // this.age = parts.reverse().join('/');
            console.log("____________________________________")
            console.log(this.name)
            console.log(this.age)
            console.log(this.phone_number)
            console.log(this.send_answer)
            console.log(this.sister_info)
            console.log("____________________________________")

            this.axios.post(this.$store.state.url + "/api/personal_info",
                {
                    child_info: this.send_answer,
                    sister_info: this.sister_info,
                    name: this.name,
                    age: this.age,
                    phone_number: this.phone_number
                })
                .then(res => {
                    console.log(res)
                    this.response = true
                    if (res.data.message == "error in some information") {
                        this.back_error = res.data.data
                        this.error_snackbar = true
                        this.send_answer = []
                        this.response = false
                        this.isSubmit = false
                    }

                    else {
                        this.snackbar = true
                        this.$router.replace({ name: 'child-list' })
                    }
                }).catch(error => {
                    this.error_snackbar = true
                })
        },
        initEdit() {
            if (this.$route.name == "edit-child") {
                this.id = this.$route.params.id
                this.edit = true
                this.axios.get(this.$store.state.url + "/api/child/show/" + this.id)
                    .then(res => {
                        this.name = res.data.data[0].name
                        this.phone_number = res.data.data[0].phone
                        this.age = res.data.data[0].birth_date
                        res.data.data[0].personal_info.forEach(item => {
                            if (item.ques_id == 6)
                                this.gender = item.answer
                            this.my_answer.forEach(itemm => {
                                if (itemm.ques_id == item.ques_id)
                                    itemm.answer = item.answer
                                if (itemm.ques_id == 4)
                                    itemm.answer = this.age
                                // if (itemm.ques_id == 1)
                                //     itemm.answer = this.name
                                // if (itemm.ques_id == 8)
                                //     itemm.answer = this.phone_number
                            })
                        })
                        console.log(res.data.data[0])
                        this.sister_info = res.data.data[0].family
                        // this.date = this.my_answer[2].answer
                    })
            }
        },
        editData() {
            let dateStr = this.age;
            let parts = dateStr.split('-');
            this.age = parts.reverse().join('/');
            this.my_answer.forEach(item => {
                if (item.ques_id == 3) {
                    let dateStr3 = item.answer;
                    let parts3 = dateStr3.split('-');
                    item.answer = parts3.reverse().join('/');
                    console.log("3")
                    console.log(item.answer)
                }
                if (item.ques_id == 11) {
                    let dateStr11 = item.answer;
                    let parts11 = dateStr11.split('-');
                    item.answer = parts11.reverse().join('/');
                    console.log("11")
                    console.log(item.answer)
                }
                if (item.ques_id != 1 && item.ques_id != 8) {
                    this.send_answer.push(item)
                }
                // if (item.answer != '') {
                // this.send_answer.push(item)
                // }

                // if (item.ques_id == 4)
                //     this.send_answer.push({
                //         ques_id: 4,
                //         answer: this.age,
                //     });
                // if (item.ques_id == 6)
                //     this.send_answer.push({
                //         ques_id: 6,
                //         answer: this.gender,
                //     });
            })
            console.log(this.name)
            console.log(this.phone_number)
            console.log(this.id)
            console.log(this.send_answer)
            console.log(this.sister_info)
            if (this.sister_info.length != 0)
                this.axios.post(this.$store.state.url + "/api/update_child_info",
                    {
                        name: this.name,
                        phone_number: this.phone_number,
                        child_id: this.id,
                        child_info: this.send_answer,
                        sister_info: this.sister_info
                    })
                    .then(res => {
                        console.log(res)
                        this.response = true
                        if (res.data.message == "error in update some information") {
                            this.back_error = res.data.data
                            this.error_snackbar = true
                            this.send_answer = []
                            this.response = false
                            this.isSubmit = false
                        }
                        else {
                            this.snackbar = true
                            this.$router.replace({ name: 'child-list' })
                        }
                    }).catch(error => {
                    this.error_snackbar = true
                })
            else {
                this.axios.post(this.$store.state.url + "/api/update_child_info",
                    {
                        name: this.name,
                        phone_number: this.phone_number,
                        child_id: this.id,
                        child_info: this.send_answer,
                    })
                    .then(res => {
                        console.log(res)
                        this.response = true
                        if (res.data.message == "error in update some information") {
                            this.back_error = res.data.data
                            this.error_snackbar = true
                            this.send_answer = []
                            this.response = false
                            this.isSubmit = false
                        }
                        else {
                            this.snackbar = true
                            this.$router.replace({ name: 'child-list' })
                        }
                    }).catch(error => {
                    this.error_snackbar = true
                })
            }
        }

    },
    mounted() {
        this.route = this.$route.name
        this.getQuestion()
        this.initEdit()
    }
};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);

.add .card-header {
    display: flex;
    justify-content: space-between;
}

.v-input--selection-controls {
    padding-top: 0px;
    margin-top: 0px;
}

.v-label {
    font-size: 18px;
}

.box {
    border: 1px solid var(--v-secondary-base);
    border-radius: 20px;
    padding: 10px 30px;
    margin: 50px 0px 80px;
}

.box-title {
    color: var(--v-primary-base);
    background: #ffd6da;
    padding: 17px 40px;
    border-radius: 30px;
    width: fit-content;
    bottom: 40px;
    position: relative;
    font-weight: bold;
}
</style>
