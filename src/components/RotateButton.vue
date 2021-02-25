<template>
  <div id="rotate-button">
    <button @click="update" class="button-color">Rotate 90 degrees</button>
    {{rotationValue}}
  </div>
</template>

<script>

const d3 = require("d3")

// State would be the angle it is positioned at?

export default {
  name: 'RotateButton',

  methods: {
    
    update() {
      this.$store.dispatch('rotateAction', 90);
      this.$store.dispatch('updateElements');
      this.animate();
    },
    
    draw(angle) {
      var canvasInstance = this.$store.getters.getCanvas;
      canvasInstance.save();

      var rectangle = this.$store.getters.getRectangle;

     // canvasInstance.clearRect(rectangle['x'], rectangle['y'], rectangle['width'], rectangle['height']);

      console.log("coordinates:", rectangle.framesX[angle-1], rectangle.framesY[angle-1]);

      canvasInstance.beginPath();              // Use this to separate shapes
      canvasInstance.fillStyle = '#FFA5FF';    // Sets the rectangle insides orange
      canvasInstance.rect(rectangle.framesX[angle-1], rectangle.framesY[angle-1], 20, 20);
      canvasInstance.fill();
      canvasInstance.closePath();

      canvasInstance.restore();



/*
      var rectangle = this.$store.getters.getRectangle;

      canvasInstance.translate(rectangle.center[0], rectangle.center[1]);
      canvasInstance.rotate(angle - 89.83);
      canvasInstance.rect(rectangle['x'], rectangle['y'], rectangle['width'], rectangle['height']);
      
      */
      //console.log(angle);
    },

    animate() {
      var incrementer = 1;

      var timer = d3.timer(() => {

        this.draw(incrementer);
        //console.log(incrementer);
        if(incrementer == 90) {
          timer.stop();
        }
        incrementer++;

      });

    }

  },

  computed: {
    rotationValue () {
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
