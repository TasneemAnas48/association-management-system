<template>
    <div class="my-date">
        <v-dialog ref="dialog" v-model="modal" :return-value.sync="localDate" persistent width="290px" color="primary">
            <template v-slot:activator="{ on, attrs }">
                <v-text-field outlined :reverse="true" v-model="localDate" :label="ques" readonly v-bind="attrs" v-on="on"
                    append-icon="mdi-calendar"></v-text-field>
            </template>
            <v-date-picker v-model="localDate" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">
                    إلغاء
                </v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(localDate)">
                    موافق
                </v-btn>
            </v-date-picker>
        </v-dialog>
    </div>
</template>

<script>

export default {
    name: 'MyDate',
    props: ["date", "ques"],
    data() {
        return {
            modal: false,
            localDate: this.date,
            id: null,
            route: '',
        }
    },
    watch: {
        localDate(newValue) {
            this.$emit('date', newValue)
        }
    },
    mounted() {
        if (this.$route.name == "edit-child") {
            this.id = this.$route.params.id
            if (!this.localDate) {
                this.axios.get(this.$store.state.url + "/api/child/show/" + this.id)
                    .then(res => {
                        res.data.data[0].personal_info.forEach(item => {
                            if (this.ques == item.question)
                                this.localDate = item.answer
                        })
                    })
            }
        }
    },
};
</script>

<style lang="scss">
.my-date .v-label--active {
    right: -30px !important
}
</style>