<template>
  <v-app>
    <div :class="[isCollapsed ? 'collapsed' : 'not-collapsed']"  v-if="!['login-admin', 'welcome', 'login-specialist', 'register-specialist', 'login-employee', 'print-child'].includes($route.name)" >
      <v-main>
        <sidebar/>
        <navbar/>
        <router-view />
      </v-main>
    </div>
    <div  v-else >
      <v-main>
        <router-view />
      </v-main>
    </div>
  </v-app>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar.vue';
export default {
  name: 'App',
  components: {
    Sidebar,
    Navbar
  },
  data: () => ({
  }),
  computed: {
  
    isCollapsed() {
      return this.$store.state.isCollapsed
    }
  },
  created() {
    
  },


};
</script>

<style lang="scss">
*{
  letter-spacing: normal !important;
}
#app{
  font-family: 'Almarai', sans-serif !important;
  direction: rtl;
  text-align: justify !important;
}
.v-application {
  background-color: #f5f7fc !important;
}

@media (max-width: 767px) {
  .v-main {
    padding-right: 65px !important;
  }
}

@media (min-width: 767px) {
.collapsed {
    padding-right: 65px;
    transition: 0.3s padding-right ease;
  }

  .not-collapsed {
    padding-right: 300px;
    transition: 0.3s padding-right ease;
  }
}


@font-face {
  font-family: "Almarai";
  src: local("Almarai"),
    url(assets/font/Almarai-Regular.ttf) format("truetype");
    font-display: swap
}

</style>
