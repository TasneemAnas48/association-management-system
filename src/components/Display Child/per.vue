<template>
    <div class="per" style="margin:40px">
        <div v-if="load">
            <div class="row" style=" justify-content: center;  align-items: end;">
                <div class="col-lg-4"
                    style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
                    <img v-if="gender == 'ذكر'" src="@/assets/img/boy2.png" style="width: 220px" />
                    <img v-if="gender == 'انثى'" src="@/assets/img/girl2.png" style="width: 220px" />
                    <div class="name">
                        {{ name }}
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="box-per">
                        <v-simple-table style=" padding: 0px; border: none;margin: 0px">
                            <template v-slot:default>
                                <tbody>
                                    <tr>
                                        <td class="my-title">رقم الطفل</td>
                                        <td>{{ child_id }}</td>
                                    </tr>
                                    <tr>
                                        <td class="my-title"> الجنس </td>
                                        <td>{{ gender }}</td>
                                    </tr>
                                    <tr>
                                        <td class="my-title"> تاريخ الميلاد</td>
                                        <td>{{ birth_date }}</td>
                                    </tr>
                                    <tr>
                                        <td class="my-title"> العمر الزمني للطفل </td>
                                        <td>{{ age }}</td>
                                    </tr>
                                    <tr>
                                        <td class="my-title"> رقم الهاتف </td>
                                        <td>{{ phone }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </div>
                </div>
            </div>
            <div class="row" style=" margin-top: 70px;  padding: 0px 15px;" v-if="personal_answer.length != 0">
                <div class="col-lg-12 box-per">
                    <div class="box-per-title">
                    معلومات عامة عن الطفل
                    </div>
                    <v-simple-table style="padding: 0px; border: none;margin: 0px; top: -30px; position: inherit;">
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="(item, index) in personal_answer" :key="index">
                                    <td class="my-title">{{ item.question }}</td>
                                    <td>{{ item.answer }}</td>
                                </tr>

                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>
            <div class="row" style=" margin-top: 70px;  padding: 0px 15px;" v-if="family_answer.length != 0">
                <div class="col-lg-12 box-per">
                    <div class="box-per-title">
                    معلومات عامة عن العائلة
                    </div>
                    <v-simple-table style="padding: 0px; border: none;margin: 0px; top: -30px; position: inherit;">
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="(item, index) in family_answer" :key="index">
                                    <td class="my-title">{{ item.question }}</td>
                                    <td>{{ item.answer }}</td>
                                </tr>

                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>
            <!-- <h6 style="margin-top: 50px; "> </h6> -->

            <div class="row" style=" margin-top: 70px;  padding: 0px 15px;" v-if="family_member.length != 0">
                <div class="col-lg-12 box-per">
                    <div class="box-per-title">
                        أسماء الأخوة وأعمارهم ومستوى تعليمهم الغير متزوجين
                    </div>
                    <v-simple-table style="padding: 0px; border: none;margin: 0px; top: -30px; position: inherit;">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-center my-title">
                                        الاسم
                                    </th>
                                    <th class="text-center my-title">
                                        الجنس
                                    </th>
                                    <th class="text-center my-title">
                                        العمر
                                    </th>
                                    <th class="text-center my-title">
                                        المستوى التعليمي
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in family_member" :key="index">
                                    <td class="text-center">{{ item.name }}</td>
                                    <td class="text-center">{{ item.gender }}</td>
                                    <td class="text-center">{{ item.age }}</td>
                                    <td class="text-center">{{ item.Educ_level }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>
        </div>
        <div class="progress-container" v-else>
            <v-progress-circular indeterminate color="primary" :size="50" style="margin-top: 100px"></v-progress-circular>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Per',
    components: {
    },
    data: () => ({
        load: false,
        child_id: null,
        data: null,
        birth_date: null,
        name: null,
        gender: null,
        phone: null,
        personal: [],
        age: null,
        personal_answer: [],
        family_answer: [],
        family_member: []
    }),
    methods: {
        getData() {
            this.axios.get(this.$store.state.url + "/api/child/show/" + this.child_id)
                .then(res => {
                    this.load = true
                    this.data = res.data.data[0]
                    this.birth_date = this.data.birth_date
                    this.name = this.data.name
                    this.phone = this.data.phone
                    this.age = this.data.age
                    this.personal = this.data.personal_info
                    console.log(this.data)
                    this.getGender()
                    this.personal.forEach(item => {
                        if (item.title == "معلومات عامة عن الطفل" && item.ques_id != 4 && item.ques_id != 5)
                            this.personal_answer.push(item);
                        else if (item.title == "معلومات عامة عن العائلة")
                            this.family_answer.push(item);
                    })
                    // this.personal_answer.filter(item => item.ques_id != 4 )
                    this.family_member = this.data.family
                });
        },
        getGender() {
            this.gender = this.personal.filter(item => item.ques_id == 5)
            this.gender = this.gender[0].answer
            // console.log(this.gender)
        }
    },
    mounted() {
        this.child_id = this.$route.params.id
        this.getData()
    }
};
</script>

<style lang="scss">
@import url(@/assets/Css/main.css);

.per .theme--light.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: transparent;
}

.per .box-per {
    border: 1px solid var(--v-secondary-base);
    border-radius: 20px;
    padding: 10px 0px;
}
.per .box-per-title {
    color: var(--v-primary-base);
    background: #ffd6da;
    padding: 17px 40px;
    border-radius: 30px;
    width: fit-content;
    bottom: 40px;
    position: relative;
    font-weight: bold;
}

.per .name {
    color: var(--v-primary-base);
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--v-secondary-base);
    border-radius: 20px;
    height: 45px;
    width: inherit;
}
.per .my-title{
    color: var(--v-primary-base) !important;
    font-weight: 600;
}
</style>
