<template>
  <div>
    <sidebar-menu :rtl="true" :menu="menu" widthCollapsed="65px" width="300px" theme="white-theme"
      @toggle-collapse="onToggleCollapse" @item-click="onItemClick">
      <template v-slot:header>
        <div class="row" style="margin-bottom: 10px">
          <img src="@/assets/img/logo.jpg" class="logo1" />
          <h4 class="side-title primary--text">الرازي للتربية الخاصة</h4>
        </div>
        <div class="line"></div>

        <!-- <div class="row header ">
          <div calss="col-lg-4">
            <div class="user-image">
              <b-icon icon="person-fill" class="primary--text"></b-icon>
            </div>
          </div>
          <div class="col-lg-5 name-email">
            <p class="name primary--text">
              الاخصائي
            </p>
          </div>
        </div> -->
      </template>
    </sidebar-menu>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
  data: () => ({
    adm_menu: [
      {
        href: "/",
        title: "لوحة التحكم",
        icon: "fa fa-home"
      },
      {
        title: "الأطفال",
        icon: "fas fa-baby",
        child: [
          {
            href: "/child/add",
            title: "إضافة طفل"
          },
          {
            href: "/child/list",
            title: "عرض الأطفال"
          }
        ]
      },
      {
        title: "الاخصائيين",
        icon: "fas fa-user-md",
        child: [
          {
            href: "/specialist/add",
            title: "إضافة اخصائي"
          },
          {
            href: "/specialist/list",
            title: "عرض الاخصائيين"
          }
        ]
      },
      {
        title: "الموظفين",
        icon: "fas fa-user-tie",
        child: [
          {
            href: "/employee/add",
            title: "إضافة موظف"
          },
          {
            href: "/employee/list",
            title: "عرض الموظفين"
          }
        ]
      },
      {
        title: "المهمات",
        icon: "fa fa-table-list ",
        child: [
          {
            href: "/appointment/add",
            title: "إضافة مهمة"
          },
          {
            href: "/appointment/list",
            title: "عرض المهام"
          }
        ]
      },
      {
        title: "تواصل مع الأهل",
        icon: "	fas fa-user-friends",
        child: [
          {
            href: "/parent/message/add",
            title: "إضافة رسالة"
          },
          {
            href: "/parent/message/list",
            title: "عرض الرسائل"
          }
        ]
      },

      {
        href: "/phones/list",
        title: "دليل الهاتف ",
        icon: "far fa-file-alt"
      },
      {
        // href: "/",
        title: "تسجيل خروج",
        icon: "fas fa-door-open"
      },
    ],
    spe_menu: [
      {
        href: "/",
        title: "لوحة التحكم",
        icon: "fa fa-home"
      },
      {
        title: "الأطفال",
        icon: "fas fa-baby",
        child: [
          {
            href: "/child/add",
            title: "إضافة طفل"
          },
          {
            href: "/child/list",
            title: "عرض الأطفال"
          }
        ]
      },
      {
        title: "المهمات",
        icon: "fa fa-table-list ",
        child: [
          {
            href: "/appointment/add",
            title: "إضافة مهمة"
          },
          {
            href: "/appointment/list",
            title: "عرض المهام"
          }
        ]
      },
      {
        title: "تواصل مع الأهل",
        icon: "	fas fa-user-friends",
        child: [
          {
            href: "/parent/message/add",
            title: "إضافة رسالة"
          },
          {
            href: "/parent/message/list",
            title: "عرض الرسائل"
          }
        ]
      },

      {
        href: "/phones/list",
        title: "دليل الهاتف ",
        icon: "far fa-file-alt"
      },
      {
        // href: "/",
        title: "تسجيل خروج",
        icon: "fas fa-door-open"
      },
    ],
    role: '',
    menu: []
  }),
  methods: {
    onToggleCollapse(collapsed) {
      this.$store.state.isCollapsed = collapsed
    },
    onItemClick(event, item, node) {
      // console.log(item.title)
      if (item.title == 'تسجيل خروج') {
        // console.log("eeeeeeeeee")
        this.removeFromStore()
        this.removeFromlocalStorage()
        this.$router.replace({ name: 'welcome' })
      }
    },
    removeFromStore() {
      // console.log("store")
      this.$store.state.token = null
      this.$store.state.id = null
      this.$store.state.name = null
      this.$store.state.email = null
      this.$store.state.role = null
    },
    removeFromlocalStorage() {
      // console.log("local storag")
      localStorage.setItem("token", '')
      localStorage.setItem("id", '')
      localStorage.setItem("name", '')
      localStorage.setItem("email", '')
      localStorage.setItem("role", '')
    }
  },
  mounted() {
    this.role = localStorage.getItem("role")
    if (this.role == "admin")
      this.menu = this.adm_menu
    else
      this.menu = this.spe_menu
  }

}
</script>


<style lang="scss">
.v-sidebar-menu .line {
  border-bottom: 1px solid gray;
  width: 90%;
  margin-right: 10px;
  margin-bottom: 15px;
}

.v-sidebar-menu .logo1 {
  width: 17%;
  height: 58%;
  margin-top: 22px;
  margin-right: 16px;
  margin-left: 20px;
}

.v-sidebar-menu {
  box-shadow: 5px 0 15px #b5b5b5;
}

.v-sidebar-menu .bi-person-fill {
  font-size: 50px;
  transition: all .3s;
}

.v-sidebar-menu .header {
  padding: 20px;
  align-items: center;
  // color: white;
}

.v-sidebar-menu .name,
.v-sidebar-menu .email {
  margin-bottom: 0px !important
}

.v-sidebar-menu .email {
  font-size: 13px;
}

.v-sidebar-menu .name-email {
  transition: all .1s;
  transition-delay: 5s;
}

.v-sidebar-menu.vsm_collapsed {
  .name-email {
    display: none;
    transition: all .1s;
    transition-delay: 5s;
  }

  .bi-person-fill {
    font-size: 45px;
    transition: all .3s;
  }

  .side-title {
    display: none;
    transition: all .1s;
  }

  .line {
    display: none;
  }

  .logo1 {
    width: 58%;
    height: 71%;
    margin-top: 22px;
    margin-right: 13px;
  }

}

.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  background-color: transparent !important;
}

.v-sidebar-menu .vsm--scroll-wrapper {
  margin-right: 0px !important;
}

.side-title {
  display: flex;
  justify-content: center;
  margin: 30px 0px;
  font-weight: bold;
}

.v-sidebar-menu.vsm_white-theme.vsm_expanded .vsm--item_open .vsm--link_level-1 {
  background-color: var(--v-primary-base) !important;
}

.v-sidebar-menu.vsm_white-theme.vsm_rtl .vsm--link_level-1.vsm--link_active,
.v-sidebar-menu.vsm_white-theme.vsm_rtl .vsm--link_level-1.vsm--link_exact-active {
  box-shadow: -3px 0px 0px 0px var(--v-primary-base) inset !important;
}

.v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover,
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover {
  background-color: var(--v-primary-base) !important;
}



.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg {
  background-color: #fff !important;
  // border: 1px solid var(--v-primary-base) !important;
}


.v-sidebar-menu.vsm_white-theme .vsm--link {
  color: var(--v-primary-base) !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_active .vsm--icon {
  color: var(--v-primary-base) !important;
}

.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1,
.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon {
  color: #fff !important;
}

.v-sidebar-menu.vsm_collapsed .vsm--link_active .vsm--icon {
  color: var(--v-primary-base) !important
}

.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
  color: var(--v-primary-base) !important
}

.v-sidebar-menu.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon {
  color: var(--v-primary-base) !important
}
</style>
