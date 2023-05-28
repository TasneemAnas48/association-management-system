<template>
    <div id="med" class="med add">
        <v-form v-if="load">
            <div class="box" v-for="(box, index) in boxes" :key="index">
                <h6 class="box-title">
                    {{ box.title }}
                </h6>
                <div v-for="(item, i) in box.question" :key="i">
                    <v-text-field outlined :reverse="true" v-if="item.type == 0" v-model="answer[item.id - 1].answer"
                        :label="item.question"></v-text-field>
                    <div class="row" style="margin-right: 5px" v-if="item.type == 1">
                        <p style="font-size: 18px;">{{ item.question }}</p>
                        <v-radio-group v-model="answer[item.id - 1].answer" row>
                            <v-radio :label="ch.choice" :value="ch.choice" v-for="(ch, j) in box.choice" :key="j"></v-radio>
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
        error_snackbar: false,
        child_id: null,
    }),
    methods: {
        getQuestion() {
            this.axios.get(this.$store.state.url + "/api/medical_title_index")
                .then(res => {
                    this.load = true
                    this.boxes = res.data
                    this.initAnswer()
                    // console.log(this.boxes[0].question.length)
                })
        },
        initAnswer() {
            this.boxes.forEach(item => {
                item.question.forEach(it => {
                    this.answer.push({
                        ques_id: it.id,
                        answer: '',
                    });
                })
            });
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
        }
    },
    mounted() {
        this.child_id = this.$route.params.id
        this.getQuestion()
    }
};
</script>

<style lang="scss">
@import url(@/assets/Css/main.css);
</style>
