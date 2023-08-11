import Vue from 'vue'
import VueRouter from 'vue-router'
import ChildList from "@/views/Child/List.vue"
import AddChild from "@/views/Child/Add.vue"
import EditChild from "@/views/Child/Add.vue"
import DisplayChild from "@/views/Child/Display.vue"
import Welcome from "@/views/Login/Welcome.vue"
import LoginAdmin from "@/views/Login/LoginAdmin.vue"
import LoginOther from "@/views/Login/LoginOther.vue"
import Dashboard from "@/views/Dashboard.vue"
import AddEmployee from "@/views/Employee/Add.vue"
import EmployeeList from "@/views/Employee/List.vue"
import AddSpecialist from "@/views/Specialist/Add.vue"
import SpecialistList from "@/views/Specialist/List.vue"
import PhonesList from "@/views/Phones.vue"
import AddAppointment from "@/views/Appointment/Add.vue"
import AppointmentList from "@/views/Appointment/List.vue"
import Study from "@/views/Study/Study.vue"
import Parent from "@/views/Parent/Parent.vue"
import ParentList from "@/views/Parent/List.vue"
import ReportChild from "@/views/Child/Report.vue"
import PrintChild from "@/views/Child/Print.vue"
import TaskFinish from "@/views/Appointment/Finish.vue"
import Register from "@/views/Login/Register.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/child/list',
    name: 'child-list',
    component: ChildList
  },
  {
    path: '/child/add',
    name: 'add-child',
    component: AddChild
  },
  {
    path: '/child/edit/:id',
    name: 'edit-child',
    component: EditChild
  },
  {
    path: '/child/display/:id',
    name: 'display-child',
    component: DisplayChild
  },
  {
    path: '/child/report/:id',
    name: 'report-child',
    component: ReportChild
  },
  {
    path: '/child/print/:id',
    name: 'print-child',
    component: PrintChild
  },
  {
    path: '/',
    name: 'welcome',
    component: Welcome
  },
  {
    path: '/login/admin',
    name: 'login-admin',
    component: LoginAdmin
  },
  {
    path: '/login/specialist',
    name: 'login-specialist',
    component: LoginOther
  },
  {
    path: '/register/specialist',
    name: 'register-specialist',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/employee/list',
    name: 'employee-list',
    component: EmployeeList
  },
  {
    path: '/employee/add',
    name: 'add-employee',
    component: AddEmployee
  },
  {
    path: '/specialist/list',
    name: 'specialist-list',
    component: SpecialistList
  },
  {
    path: '/specialist/add',
    name: 'add-specialist',
    component: AddSpecialist
  },
  {
    path: '/appointment/list',
    name: 'appointment-list',
    component: AppointmentList
  },
  {
    path: '/appointment/add',
    name: 'add-appointment',
    component: AddAppointment
  },
  {
    path: '/task/finish/:id',
    name: 'task-finish',
    component: TaskFinish
  },
  {
    path: '/phones/list',
    name: 'phones-list',
    component: PhonesList
  },
  {
    path: '/child/study/:id',
    name: 'child-study',
    component: Study
  },
  {
    path: '/parent/message/add',
    name: 'parent-add',
    component: Parent
  },
  {
    path: '/parent/message/list',
    name: 'parent-list',
    component: ParentList
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
