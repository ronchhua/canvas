<template>
  <div id="rotate-button">
    <button @click="update" class="button-color">Rotate 90 degrees</button>
    {{rotate}}
  </div>
</template>

<script>

// State would be the angle it is positioned at?

export default {
  name: 'RotateButton',
  components: {
  },
  props: {
    rectangle: Object,
    circle: Object,
    images: Array,
  },

  data() {
    return{}
  },

  mounted() {

  },

  methods: {
    
    update() {
      this.$store.dispatch('rotateAction', 90);
    },
    
    draw() {

    },

  },

  computed: {
    rotate () {
        return this.$store.getters.getRotation;
    },
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

#rotate-button {
  text-align: left;
}

</style>
