<template>
    <div class="med-display" style="margin:80px 40px" v-if="load">
        <div v-if="medical == 'done'">
            <div v-for="(box, index) in boxes" :key="index">
                <div class="box" v-if="box.question.length != 0">
                    <div class="box-title">
                        {{ box.title }}
                    </div>
                    <v-simple-table style="padding: 0px; border: none;margin: 0px; top: -20px; position: relative;">
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="(item, index) in box.question" :key="index">
                                    <td class="my-title">{{ item.question }}</td>
                                    <td>{{ item.answer }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>
        </div>
        <div class="med-display" v-else-if="medical == 'not'">
            <div class="img-container">
                <img src="@/assets/img/no-data.svg" style="width: 45%" />
                <p class="text">
                    لايوجد معلومات، لم تقم بدراسة حالة المجال الطبي سابقاً
                </p>
            </div>
        </div>
    </div>
    <div class="progress-container" v-else>
        <v-progress-circular indeterminate color="primary" :size="50" style="margin-top: 100px"></v-progress-circular>
    </div>
</template>

<script>

export default {
    name: 'Med',
    components: {
    },
    data: () => ({
        boxes: [],
        load: false,
        child_id: null,
        medical: null
    }),
    methods: {
        getData() {
            this.axios.put(this.$store.state.url + "/api/medical_answer", { id: this.child_id })
                .then(res => {
                    this.load = true
                    this.boxes = res.data
                    // console.log(res.data)
                    this.boxes.forEach(box => {
                        box.question = box.question.filter(item => item.answer != "null")
                    })
                });
        },
        ifDone() {
            this.axios.post(this.$store.state.url + "/api/done_Education_Medical", { id: this.child_id })
                .then(res => {
                    // 
                    this.medical = res.data.medical
                    if (this.medical == 'done')
                        this.getData()
                    else
                        this.load = true
                    // console.log(res.data)
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

.med-display .theme--light.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: transparent;
}

.med-display .my-title {
    color: var(--v-primary-base) !important;
    font-weight: 600;
}

.med-display .img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 25px;
    margin-top: 50px
}

.med-display .text {
    font-size: 20px;
    font-weight: bold;
}
</style>
