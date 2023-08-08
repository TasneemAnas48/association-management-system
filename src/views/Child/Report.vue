<template>
    <div id="child-report" class="child-report report list">
        <div class="card">
            <div class="card-header">
                تقرير طفل
                <v-btn color="primary" outlined @click="print">
                    طباعة التقرير
                </v-btn>
            </div>
            <div class="card-body" v-if="load">
                <div class="row" style="justify-content: center;">
                    التقرير النفسي التربوي
                </div>
                <div class="row" style="justify-content: center;">
                    <v-simple-table style="width: 600px">
                        <template v-slot:default>
                            <tbody>
                                <tr>
                                    <td>{{ data[0].name }} </td>
                                    <td>{{ data[0].test_date }}</td>
                                </tr>
                                <tr>
                                    <td>{{ data[0].father }} </td>
                                    <td>{{ data[0].birth_date }} </td>
                                </tr>
                                <tr>
                                    <td>{{ data[0].mother }} </td>
                                    <td>{{ data[0].t_age }} </td>
                                </tr>
                                <tr>
                                    <td>{{ data[0].phone }} </td>
                                    <td>{{ data[0].type_disorder }} </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
                <div style="margin-top: 50px">
                    <h6 class="header">أولا: لمحة عامة عن الحالة</h6>
                    <ul style="margin-right: 16px;margin-top: 15px">
                        <li>
                            <h6 class="header2">سبب الإحالة:</h6>
                            {{ data[0].referral_reason }}
                        </li>
                        <li style="margin-top: 10px">
                            <h6 class="header2"> معلومات عن الأسرة:</h6>
                            {{ data[0].family_info }}
                        </li>
                        <li style="margin-top: 10px">
                            <h6 class="header2">الحالة السريرية للحمل:</h6>
                            {{ data[0].pregnancy_mother }}
                        </li>
                        <li style="margin-top: 10px">
                            <h6 class="header2">التطور النمو العام للطفل والناحية السيكولوجية:</h6>
                            {{ data[0].child_dev }}
                        </li>
                        <li style="margin-top: 10px">
                            <h6 class="header2">الشكوى الرئيسية للأسرة :</h6>
                            {{ data[0].problems }}
                        </li>
                        <li style="margin-top: 10px">
                            <h6 class="header2">المراكز التي راجعها الطفل:</h6>
                            {{ data[0].positions }}
                        </li>
                    </ul>
                    <h6 class="header" style="margin-top: 30px">ثانياً: ملاحظات الفاحص</h6>
                    <h6 style="margin-right: 25px">
                        {{ data[0].notes }}
                    </h6>
                    <h6 class="header" style="margin-top: 30px">ثالثاً: نتائج التقييم</h6>
                    <ul style="margin-right: 16px;margin-top: 15px">
                        <li>
                            <h6 class="header">الطبي:</h6>
                            {{ data[0].medical_resault }}
                        </li>
                        <li style="margin-top: 10px">
                            <h6 class="header"> التربوي:</h6>
                            {{ data[0].educ_resault }}
                        </li>
                    </ul>
                </div>
                <div class="row justify-content-center" style="margin-top: 50px">
                    <div class="col-lg-10">
                        <v-simple-table dense>
                            <template v-slot:default>
                                <thead>
                                    <tr style="height: 65px;">
                                        <th class="text-center">
                                            المجالات
                                        </th>
                                        <th class="text-center">
                                            مستوى الأداء
                                        </th>
                                        <th class="text-center">
                                            نسبة الأداء
                                        </th>
                                        <th class="text-center" colspan="2">
                                            العمر النمائي
                                            <div class="row" style="margin-top: 0px">
                                                <div class="col-lg-6">
                                                    الاشهر
                                                </div>
                                                <div class="col-lg-6">
                                                    السنوات
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="text-center">
                                        <td>العمر الاجتماعي</td>
                                        <td>{{ social.performance }}</td>
                                        <td>{{ social.performance_ratio }}</td>
                                        <td>{{ social.month }}</td>
                                        <td>{{ social.year }}</td>
                                    </tr>
                                    <tr class="text-center">
                                        <td>العمر المعرفي</td>
                                        <td>{{ know.performance }}</td>
                                        <td>{{ know.performance_ratio }}</td>
                                        <td>{{ know.month }}</td>
                                        <td>{{ know.year }}</td>
                                    </tr>
                                    <tr class="text-center">
                                        <td>العمر الاتصالي</td>
                                        <td>{{ comm.performance }}</td>
                                        <td>{{ comm.performance_ratio }}</td>
                                        <td>{{ comm.month }}</td>
                                        <td>{{ comm.year }}</td>
                                    </tr>
                                    <tr class="text-center">
                                        <td>العمر في العناية الذاتية</td>
                                        <td>{{ care.performance }}</td>
                                        <td>{{ care.performance_ratio }}</td>
                                        <td>{{ care.month }}</td>
                                        <td>{{ care.year }}</td>
                                    </tr>
                                    <tr class="text-center">
                                        <td>العمر الحركي</td>
                                        <td>{{ monotor.performance }}</td>
                                        <td>{{ monotor.performance_ratio }}</td>
                                        <td>{{ monotor.month }}</td>
                                        <td>{{ monotor.year }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </div>
                </div>
                <div style="margin-top: 50px" id="chart" class="row justify-content-center">
                    <div class="col-lg-10">
                        <apexchart ref="chart" type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
                    </div>
                </div>
                <div style="margin-top: 50px">
                    <h6 class="header">
                        العمر الاجتماعي
                    </h6>
                    <p>
                        {{ data[0]['العمر الاجتماعي'] }}
                    </p>
                    <h6 class="header">
                        العمر المعرفي
                    </h6>
                    <p>
                        {{ data[0]['العمر المعرفي'] }}
                    </p>
                    <h6 class="header">
                        العمر الاتصالي
                    </h6>
                    <p>
                        {{ data[0]['العمر الاتصالي'] }}
                    </p>
                    <h6 class="header">
                        العمر في العناية الذاتية
                    </h6>
                    <p>
                        {{ data[0]['العمر في العنايه الذاتيه'] }}
                    </p>
                    <h6 class="header">
                        العمر الحركي
                    </h6>
                    <p>
                        {{ data[0]['العمر الحركي'] }}
                    </p>
                </div>
                <!-- <h6 class="header" style="margin-top: 30px">رابعاً: الخلاصة</h6>
                <h6>
                    {{ data2.summary }}
                </h6> -->
                <h6 class="header" style="margin-top: 30px">رابعاً: أدوات التقييم</h6>
                <h6>
                    {{ data2.evaluation_tools }}
                </h6>
                <!-- <h6 class="header" style="margin-top: 30px">سادساً: التوصيات </h6>
                <h6>
                    {{ data2.recomm }}
                </h6> -->
                <div class="row" style="margin-top: 100px">
                    <div class="col-lg-6" style=" text-align: center;">
                        <h6 class="header">الاخصائية النفسية </h6>
                        <p>{{ data[0]['الأخصائية الفسية'] }}</p>
                    </div>
                    <div class="col-lg-6" style=" text-align: center;">
                        <h6 class="header"> المدير </h6>
                        <p>{{ data[0][' المدير'] }}</p>
                    </div>
                </div>
            </div>
            <div class="progress-container" v-else>
                <v-progress-circular indeterminate color="primary" :size="50"
                    style="margin-top: 100px"></v-progress-circular>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue"
import VueApexCharts from "vue-apexcharts"
Vue.use(VueApexCharts)
Vue.component("apexchart", VueApexCharts)

export default {
    name: 'Report',
    components: {
        apexchart: VueApexCharts,
    },
    data: () => ({
        series: [],
        chartOptions: {
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '20%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth",
            },
            colors: ['#0f2032', '#ee1d32'],
            xaxis: {
                categories: ['الحركي', 'العناية', 'الاتصالي', 'المعرفي', 'الاجتماعي'],
            },
            yaxis: {
                floating: true,
                decimalsInFloat: 2
            },
            fill: {
                opacity: 1
            },
        },
        chart_new: [],
        chart_old: [],
        data: null,
        data2: null,
        id: '',
        load: false,
        social: null,
        monotor: null,
        care: null,
        comm: null,
        know: null
    }),
    methods: {
        print() {
            this.$router.replace({ name: 'print-child', params: { id: this.id } })
        }
    },
    computed: {
    },
    mounted() {
        this.id = this.$route.params.id
        this.axios.post(this.$store.state.url + "/api/Report/" + this.id,
            {
                recomm: '',
                summary: ''
            })
            .then(res => {
                this.load = true
                console.log(res.data)
                this.data2 = res.data
                this.data = res.data.data
                this.social = this.data[0].social
                this.monotor = this.data[0].monotor
                this.care = this.data[0].care
                this.comm = this.data[0].comm
                this.know = this.data[0].know
                this.chart_old.push(this.data2.data[0].old_montor_ratio)
                this.chart_old.push(this.data2.data[0].old_care_ratio)
                this.chart_old.push(this.data2.data[0].old_comm_ratio)
                this.chart_old.push(this.data2.data[0].old_know_ratio)
                this.chart_old.push(this.data2.data[0].old_social_ratio)

                this.chart_new.push(this.data2.data[0].new_montor_ratio)
                this.chart_new.push(this.data2.data[0].new_care_ratio)
                this.chart_new.push(this.data2.data[0].new_comm_ratio)
                this.chart_new.push(this.data2.data[0].new_know_ratio)
                this.chart_new.push(this.data2.data[0].new_social_ratio)
                console.log(this.chart_new)
                this.series = [
                    {
                        name: 'جديد',
                        data: this.chart_new
                    },
                    {
                        name: 'قديم',
                        data: this.chart_old
                    }
                ];
            });

    }
};
</script>

<style lang="scss">
@import url(../../assets/Css/main.css);

.report .v-data-table {
    padding: 0px !important
}

.report .header {
    font-weight: bold;
}

.report .header2 {
    font-weight: bold;
    display: inline;
}
</style>
