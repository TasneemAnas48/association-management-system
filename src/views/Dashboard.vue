<template>
    <div id="dashboard" class="dashboard">
        <!-- Header -->
        <div class="container">
            <div class="body row" style="margin-top: 10px; row-gap: 15px;">
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="card mini-card">
                        <div class="card-body">
                            <div class="row row-header">
                                <h5 class="color"> الاطفال</h5>
                            </div>
                            <div class="row" style="align-items: end;margin-top: 0px">
                                <div class="col-lg-8">
                                    <h4 class="color">{{ numbers.child_numbers }}</h4>
                                </div>
                                <div class="col-lg-4">
                                    <i class='fas fa-baby'></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="card mini-card">
                        <div class="card-body">
                            <div class="row row-header">
                                <h5 class="color">الاخصائيين </h5>
                            </div>
                            <div class="row" style="align-items: end;margin-top: 0px">
                                <div class="col-lg-8">
                                    <h4 class="color">{{ numbers.specific_numbers }}</h4>
                                </div>
                                <div class="col-lg-4">
                                    <i class='fas fa-user-md'></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="card mini-card">
                        <div class="card-body">
                            <div class="row row-header">
                                <h5 class="color"> الموظفين</h5>
                            </div>
                            <div class="row" style="align-items: end;margin-top: 0px">
                                <div class="col-lg-8">
                                    <h4 class="color">{{ numbers.emp_numbers  }}</h4>
                                </div>
                                <div class="col-lg-4">
                                    <i class='fas fa-user-tie'></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="card mini-card">
                        <div class="card-body">
                            <div class="row row-header">
                                <h5 class="color"> المهمات الغير منتهية</h5>
                            </div>
                            <div class="row" style="align-items: end;margin-top: 0px">
                                <div class="col-lg-8">
                                    <h4 class="color">{{ numbers.task_numbers }}</h4>
                                </div>
                                <div class="col-lg-4">
                                    <i class='fa fa-table-list'></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Infection Chart -->
        <div class="container">
            <div class="body row" style="margin-top: 10px;row-gap: 15px;">
                <div class="col-lg-7">
                    <div class="card mini-card" id="chart">
                        <div class="card-header" style="padding: 10px 40px !important;">
                            <div class="d-flex justify-content-between align-items-center add">
                                مستوى الاصابات
                                <v-btn @click="dialogInfection = true" color="primary" outlined style="margin: 15px 0px">
                                    السنة
                                </v-btn>
                            </div>
                        </div>
                        <div class="card-body">
                            <apexchart ref="chart_infection" type="bar" height="293" :options="chartOptions"
                                :series="series">
                            </apexchart>
                        </div>
                        <v-dialog v-model="dialogInfection" max-width="600px">
                            <v-card>
                                <v-spacer></v-spacer>
                                <v-card-title class="justify-content-start"
                                    style="border-bottom: 1px solid #aeaeae;padding-top: 30px;font-weight: bold;margin-bottom: 40px;">
                                    مستوى الاصابات في سنة
                                </v-card-title>
                                <div style="margin: 0px 30px">
                                    <v-form>
                                        <v-select outlined v-model="start_infection" :reverse="true" :items="years_list"
                                            label="بدءا من سنة"></v-select>
                                        <v-select outlined v-model="end_infection" :reverse="true" :items="years_list"
                                            label="الى سنة"></v-select>
                                    </v-form>
                                </div>
                                <v-divider></v-divider>
                                <v-card-actions style="justify-content: end; padding-bottom: 30px;margin-left: 20px;">
                                    <v-btn @click="getInfection" color="primary" light>
                                        اختيار
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="card mini-card" id="chart2" style=" min-height: 445px;">
                        <div class="card-header" style="padding: 10px 40px !important;">
                            <div class="d-flex justify-content-between align-items-center add">
                                احصائيات الامراض
                                <v-btn @click="dialogDiseases = true" color="primary" outlined style="margin: 15px 0px">
                                    السنة
                                </v-btn>
                            </div>
                        </div>
                        <div class="card-body">
                            <apexchart ref="chart_diseases" type="polarArea" height="250" :options="chartOptions_diseases"
                                :series="series_diseases" style="margin-top:50px">
                            </apexchart>
                        </div>
                        <v-dialog v-model="dialogDiseases" max-width="600px">
                            <v-card>
                                <v-spacer></v-spacer>
                                <v-card-title class="justify-content-start"
                                    style="border-bottom: 1px solid #aeaeae;padding-top: 30px;font-weight: bold;margin-bottom: 40px;">
                                    احصائيات الامراض في سنة
                                </v-card-title>
                                <div style="margin: 0px 30px">
                                    <v-form>
                                        <v-select outlined v-model="start_diseases" :reverse="true" :items="years_list"
                                            label="بدءا من سنة"></v-select>
                                        <v-select outlined v-model="end_diseases" :reverse="true" :items="years_list"
                                            label="الى سنة"></v-select>
                                    </v-form>
                                </div>
                                <v-divider></v-divider>
                                <v-card-actions style="justify-content: end; padding-bottom: 30px;margin-left: 20px;">
                                    <v-btn @click="getDiseases" color="primary" light>
                                        اختيار
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </div>
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
    name: 'Dashboard',
    components: {
        apexchart: VueApexCharts,
    },
    data: () => ({
        series: [{
            name: "عدد الاطفال",
            data: []
        }],
        chartOptions: {
            chart: {
                type: "bar",
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            colors: ['#ff00007a'],
            xaxis: {
                categories: [
                    'شديد جداً',
                    'شديد',
                    'متوسط',
                    'بسيط',
                    'بسيط جداً',
                    'طبيعي',
                ],
            },
        },
        infections: null,
        dialogInfection: false,
        years_list: ['2023', '2022', '2021', '2020'],
        start_infection: '',
        end_infection: '',



        series_diseases: [],
        chartOptions_diseases: {
            chart: {
                type: 'polarArea',
            },
            fill: {
                colors: ['#0f2032', '#ee1d32']
            },
            colors: ['#0f2032', '#ee1d32'],
            stroke: {
                colors: ['#fff']
            },
            labels: ['داون', 'توريت'],
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "  طفل"
                    }
                }
            }
        },
        diseases: null,
        dialogDiseases: false,
        start_diseases: '',
        end_diseases: '',
        numbers: {child_numbers: "", emp_numbers: "", specific_numbers: "", task_numbers:""}
    }),
    methods: {
        getInfection() {
            if (this.start_infection == '')
                this.start_infection = '2023'
            this.axios.get(this.$store.state.url + "/api/All_Infections/" + this.start_infection + "," + this.end_infection)
                .then(res => {
                    this.infections = res.data
                    const arr = [this.infections['شديد جداً'], this.infections['شديد'], this.infections['متوسط'], this.infections['بسيط'], this.infections['بسيط جداً'], this.infections['طبيعي']]
                    // console.log(arr)
                    this.$refs.chart_infection.updateSeries([{
                        data: arr
                    }]);
                    this.dialogInfection = false
                });
        },
        getDiseases() {
            if (this.start_diseases == '')
                this.start_diseases = '2023'
            this.axios.get(this.$store.state.url + "/api/All_Diseases/" + this.start_diseases + "," + this.end_diseases)
                .then(res => {
                    this.diseases = res.data
                    // console.log(this.diseases)
                    this.series_diseases = [this.diseases[1][0], this.diseases[2][0]]
                    this.dialogDiseases = false
                });
        },
        getNumbers() {
            this.axios.get(this.$store.state.url + "/api/report/numbers")
                .then(res => {
                    this.numbers = res.data.data
                    console.log(res.data.data)
                });
        }
    },
    mounted() {
        this.getInfection()
        this.getDiseases()
        this.getNumbers()
    }
};
</script>

<style lang="scss">
@import url(../assets/Css/main.css);

.dashboard .v-card__title {
    color: var(--v-primary-base)
}


.dashboard .my-title {
    margin-right: 25px !important
}

.dashboard .v-card {
    box-shadow: 0 0 10px #d0cbcb4d !important;
    margin: 25px 0px !important;
    border-radius: 18px !important;
    text-align: justify;
    border: none !important;
    padding: 20px 0px;
}


.dashboard .mini-card {
    margin: 0px !important
}

.dashboard .v-data-table {
    /* box-shadow: 0 0 10px #d0cbcb4d !important; */
    /* border-radius: 18px !important; */
    text-align: justify;
    border: none !important;
}

.theme--light.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: transparent !important;
}

.dashboard .row-header {
    align-items: center;
    margin-bottom: 10px;
}

.dashboard .card-body {
    padding: 25px 40px !important
}

.dashboard .fa-table-list {
    color: #ee1d32;
    padding: 10px;
    font-size: 30px;
    border-radius: 15px;
    background-color: #ff000014;
}

.dashboard .fa-baby {
    color: #0f2032;
    padding: 10px;
    font-size: 30px;
    border-radius: 15px;
    background-color: rgba(0, 0, 255, 0.068);
}

.dashboard .fa-user-tie {
    color: #0f2032;
    padding: 10px;
    font-size: 30px;
    border-radius: 15px;
    background-color: rgba(0, 0, 255, 0.068);
}

.dashboard .fa-user-doctor {
    color: #ee1d32;
    padding: 10px;
    font-size: 30px;
    border-radius: 15px;
    background-color: #ff000014;
}

.dashboard h5 {
    font-size: 17px !important;
    color: var(--v-primary-base);
}

.dashboard h4 {
    color: var(--v-accent-base);
}

.dashboard .card-header {
    color: var(--v-primary-base) !important;
}
</style>
