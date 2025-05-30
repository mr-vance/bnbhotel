<template>
  <b-navbar toggleable :class="classes">
    <div :class="containerClasses">
      <slot name="brand">
        <a href="/" class="navbar-brand">YUMOMITSO Invoicing</a>
      </slot>

      <slot name="toggle-button">
        <button
          class="navbar-toggler collapsed"
          v-if="hasMenu"
          type="button"
          @click="toggleMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-bar navbar-kebab"></span>
          <span class="navbar-toggler-bar navbar-kebab"></span>
          <span class="navbar-toggler-bar navbar-kebab"></span>
        </button>
      </slot>

      <b-navbar-toggle
        target="nav-text-collapse"
        @click.stop="toggleMenu">
      </b-navbar-toggle>

      <b-collapse
        is-nav
        id="nav-text-collapse"
        class="navbar-custom-collapse collapse"
        :class="menuClasses"
        :visible="show"
        v-click-outside="closeMenu">
        <b-nav class="flex-column">
          <b-nav-item to="/dashboard">
            <i class="ni ni-tv-2"></i>
            <span>Dashboard</span>
          </b-nav-item>
          <b-nav-item to="/clients">
            <i class="ni ni-single-02"></i>
            <span>Clients</span>
          </b-nav-item>
          <b-nav-item to="/quotes">
            <i class="ni ni-bullet-list-67"></i>
            <span>Quotes</span>
          </b-nav-item>
          <b-nav-item to="/invoices">
            <i class="ni ni-collection"></i>
            <span>Invoices</span>
          </b-nav-item>
        </b-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>
<script>
export default {
  name: 'base-nav',
  props: {
    show: {
      type: Boolean,
      default: false,
      description: 'Whether navbar menu is shown (valid for viewports < specified by `expand` prop)'
    },
    transparent: {
      type: Boolean,
      default: false,
      description: 'Whether navbar is transparent'
    },
    expand: {
      type: String,
      default: 'lg',
      description: 'Breakpoint where nav should expand'
    },
    menuClasses: {
      type: [String, Object, Array],
      default: '',
      description: 'Navbar menu (items) classes. Can be used to align menu items to the right/left'
    },
    containerClasses: {
      type: [String, Object, Array],
      default: 'container',
      description: 'Container classes. Can be used to control container classes (contains both navbar brand and menu items)'
    },
    type: {
      type: String,
      default: '',
      validator(value) {
        return [
          '',
          'dark',
          'success',
          'danger',
          'warning',
          'white',
          'primary',
          'light',
          'info',
          'vue'
        ].includes(value);
      },
      description: 'Navbar color type'
    }
  },
  model: {
    prop: 'show',
    event: 'change'
  },
  computed: {
    classes() {
      let color = `bg-${this.type}`;
      let classes = [
        { 'navbar-transparent': this.transparent },
        { [`navbar-expand-${this.expand}`]: this.expand }
      ];
      if (this.position) {
        classes.push(`navbar-${this.position}`);
      }
      if (!this.transparent) {
        classes.push(color);
      }
      return classes;
    },
    hasMenu() {
      return this.$slots.default || true;
    }
  },
  methods: {
    toggleMenu() {
      this.$emit('change', !this.show);
    },
    closeMenu() {
      this.$emit('change', false);
    }
  }
};
</script>
<style>
.navbar-brand {
  font-weight: bold;
  color: #fff !important;
}
.navbar-custom-collapse .nav-link {
  color: #fff;
  padding: 0.75rem 1rem;
}
.navbar-custom-collapse .nav-item i {
  margin-right: 0.5rem;
}
</style>