<template>
    <div id="med" class="med add">
        <v-form v-if="load">
            <div class="box" v-for="(box, index) in boxes" :key="index">
                <h6 class="box-title">
                    {{ box.title }}
                </h6>
                <div v-for="(item, i) in box.list" :key="i">
                    <v-text-field outlined :reverse="true" v-if="item.type == 0 && item.id != 32"
                        v-model="answer[item.id - 1].answer" :label="item.question"></v-text-field>
                    <div class="row" v-if="item.id == 32">
                        <div class="col-lg-10">
                            <v-select outlined v-model="answer[item.id - 1].answer" :reverse="true" :items="dis"
                                item-text="name" item-value="name" :label="item.question"></v-select>
                        </div>
                        <div class="col-lg-2">
                            <v-btn outlined color="primary" @click="dialog = true"
                                style="margin-top: 20px;height: 55px">إضافة
                                مرض</v-btn>
                            <v-dialog v-model="dialog" max-width="500px" persistent>
                                <v-card>
                                    <v-card-title>
                                        <span class="text-h5" style="color: var(--v-primary-base)">إضافة مرض</span>
                                    </v-card-title>
                                    <v-divider></v-divider>
                                    <div class="container">
                                        <v-text-field outlined :reverse="true" v-model="dis_name"
                                            label="اسم المرض"></v-text-field>
                                    </div>
                                    <v-card-actions style="top: -30px;position: inherit;justify-content: end;">
                                        <v-btn color="blue darken-1" text @click="add_dis">
                                            حفظ
                                        </v-btn>
                                        <v-btn color="blue darken-1" text @click="dialog = false">
                                            إلغاء
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>
                    </div>
                    <div class="row" style="margin-right: 5px" v-if="item.type == 1">
                        <p style="font-size: 18px;">{{ item.question }}</p>
                        <v-radio-group v-model="answer[item.id - 1].answer" row>
                            <v-radio :label="ch.choice" :value="ch.choice" v-for="(ch, j) in item.choice"
                                :key="j"></v-radio>
                        </v-radio-group>
                    </div>
                </div>
            </div>
            <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light style="margin-top: 15px">
                حفظ
                <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                    color="white"></v-progress-circular>
            </v-btn>
            <v-snackbar right bottom color="green" text v-model="snackbar" timeout="5000">
                تم تسجيل دراسة حالة القسم الطبي بنجاح
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
            <v-snackbar right bottom color="green" text v-model="dis_snackbar" timeout="5000">
                تم إضافة المرض بنجاح
                <template v-slot:action="{ attrs }">
                    <v-btn color="green" text v-bind="attrs" @click="dis_snackbar = false">
                        اغلاق
                    </v-btn>
                </template>
            </v-snackbar>
            <v-snackbar right bottom color="red" text v-model="validation_snackbar" timeout="5000">
                الرجاء ادخال اسم المرض
                <template v-slot:action="{ attrs }">
                    <v-btn color="red" text v-bind="attrs" @click="validation_snackbar = false">
                        اغلاق
                    </v-btn>
                </template>
            </v-snackbar>
        </v-form>
        <div class="progress-container" v-else>
            <v-progress-circular indeterminate color="primary" :size="50" style="margin-top: 100px"></v-progress-circular>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Med',
    components: {
    },
    data: () => ({
        boxes: [],
        answer: [],
        send_answer: [],
        load: false,
        response: false,
        isSubmit: false,
        snackbar: false,
        validation_snackbar: false,
        error_snackbar: false,
        dis_snackbar: false,
        child_id: null,
        dis: [],
        dialog: false,
        dis_name: ''
    }),
    methods: {
        getQuestion() {
            this.axios.get(this.$store.state.url + "/api/medical_title_index")
                .then(res => {
                    this.load = true
                    this.boxes = res.data
                    console.log(res.data)
                    this.initAnswer()
                    // console.log(this.boxes[0].question.length)
                })
        },
        initAnswer() {
            this.boxes.forEach(item => {
                item.list.forEach(it => {
                    this.answer.push({
                        ques_id: it.id,
                        answer: '',
                    });
                })
            });
        },
        add_dis() {
            if(this.dis_name != ''){
                const token = localStorage.getItem("token")
            const formData = new FormData()
            formData.append('name', this.dis_name)
            this.axios.post(this.$store.state.url + "/api/add_Diseases", formData, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    console.log(res.data)
                    if (res.data.message == 'A name has been inserted successfully') {
                        this.dialog = false
                        this.dis_snackbar = true
                        this.get_diseases()
                    }
                    else
                        this.error_snackbar = true
                }).catch(error => {
                    this.error_snackbar = true
                })
            }
            else{
                this.validation_snackbar = true
            }
            
        },
        submit() {
            this.isSubmit = true
            console.log(this.answer)
            this.answer.forEach(item => {
                if (item.answer == '')
                    this.send_answer.push({
                        ques_id: item.ques_id,
                        answer: 'null',
                    })
                else this.send_answer.push({
                    ques_id: item.ques_id,
                    answer: item.answer,
                })
            })
            this.sendData()
        },
        sendData() {
            console.log(this.send_answer)
            console.log(this.child_id)
            this.axios.post(this.$store.state.url + "/api/medical_store",
                {
                    child_id: this.child_id,
                    ans: this.send_answer
                })
                .then(res => {
                    console.log(res)
                    this.response = true
                    if (res.status == 200)
                        this.snackbar = true
                });
        },
        get_diseases() {
            this.axios.get(this.$store.state.url + "/api/ShowDiseases")
                .then(res => {
                    this.load = true
                    this.dis = res.data
                    console.log(res.data)
                })
        }
    },
    mounted() {
        this.child_id = this.$route.params.id
        this.getQuestion()
        this.get_diseases()
    }
};
</script>

<style lang="scss">@import url(@/assets/Css/main.css);</style>
