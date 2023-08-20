<template>
    <div class="edu-display" style="margin:80px 40px" v-if="load">
        <div v-if="education == 'done'">
            <div v-for="(box, index) in boxes" :key="index">
                <div class="box" v-if="box.question.length != 0">
                    <div v-if="box.title != 'no title'">
                        <div class="box-title">
                            {{ box.title }}
                        </div>
                        <v-simple-table v-if="index != 6"
                            style="padding: 0px; border: none;margin: 0px; top: -20px; position: relative;">
                            <template v-slot:default>
                                <tbody>
                                    <tr v-for="(item, index) in box.question" :key="index">
                                        <td class="my-title">{{ item.question }}</td>
                                        <td>{{ item.answer }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                        <div v-else>
                            <v-simple-table style="padding: 0px; border: none;margin: 0px; position: relative;">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-center">
                                                اسم المركز
                                            </th>
                                            <th class="text-center">
                                                التشخيص
                                            </th>
                                            <th class="text-center">
                                                الاخصائي
                                            </th>
                                            <th class="text-center">
                                                التأهيل
                                            </th>
                                            <th class="text-center">
                                                محاور التأهيل
                                            </th>
                                            <th class="text-center">
                                                المدة الزمنية
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in box.question" :key="index">
                                            <td class="text-center">{{ item.center_name }}</td>
                                            <td class="text-center">{{ item.diagnosis }}</td>
                                            <td class="text-center">{{ item.specialist }}</td>
                                            <td class="text-center">{{ item.qualification }}</td>
                                            <td class="text-center">{{ item.qualification_axes }}</td>
                                            <td class="text-center">{{ item.time }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="edu-display" v-else-if="education == 'not'">
            <div class="img-container">
                <img src="@/assets/img/no-data.svg" style="width: 45%" />
                <p class="text">
                    لايوجد معلومات، لم تقم بدراسة حالة المجال التربوي سابقاً
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
    name: 'Edu',
    components: {
    },
    data: () => ({
        boxes: [],
        load: false,
        child_id: null,
        education: null
    }),
    methods: {
        getData() {
            this.axios.put(this.$store.state.url + "/api/educational_answer", { id: this.child_id })
                .then(res => {
                    this.load = true
                    this.boxes = res.data
                    console.log(res.data)
                    this.boxes.forEach(box => {
                        box.question = box.question.filter(item => item.answer != "null")
                    })
                });
        },
        ifDone() {
            this.axios.post(this.$store.state.url + "/api/done_Education_Medical", { id: this.child_id })
                .then(res => {
                    this.education = res.data.education
                    if (this.education == 'done')
                        this.getData()
                    else
                        this.load = true
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

.edu-display .theme--light.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: transparent;
}

.edu-display .my-title {
    color: var(--v-primary-base) !important;
    font-weight: 600;
}

.edu-display .img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 25px;
    margin-top: 50px
}

.edu-display .text {
    font-size: 20px;
    font-weight: bold;
}
</style>
