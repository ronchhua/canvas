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
      this.clearFrames();
    },
    
    drawRect(canvasInstance, image, angle) {


        // Saves the current state of all the elements in canvas
        canvasInstance.save();
  
        canvasInstance.translate(image.origX + (image.origWidth/2), image.origY + (image.origHeight/2));

        canvasInstance.beginPath();              // Use this to separate shapes
        canvasInstance.fillStyle = '#FFA500';    // Sets the rectangle insides orange
        canvasInstance.rotate(angle * (Math.PI / 180));

        canvasInstance.translate(-1*(image.origX+(image.origWidth/2)), -1*(image.origY+(image.origHeight/2)));
        canvasInstance.clearRect(image['origX']-2, image['origY']-2, image['origWidth']+2, image['origHeight']);
        canvasInstance.clearRect(image['origX'], image['origY'], image['origWidth']+2, image['origHeight']+2);

        canvasInstance.rect(image['origX'], image['origY'], image['origWidth'], image['origHeight']);

        canvasInstance.fill();
        canvasInstance.closePath();

        canvasInstance.restore(); //Restores those states.
    },

    drawImages(canvasInstance, image, angle, imageElement) {
        // Saves the current state of all the elements in canvas
        canvasInstance.save();

        canvasInstance.translate(image.origX + (image.origWidth/2), image.origY + (image.origHeight/2));

        canvasInstance.beginPath();              // Use this to separate shapes
        canvasInstance.rotate(angle * (Math.PI / 180));
        canvasInstance.translate(-1*(image.origX+(image.origWidth/2)), -1*(image.origY+(image.origHeight/2)));

        canvasInstance.clearRect(image['origX']-3, image['origY']-3, image['origWidth']+2, image['origHeight']+2);
        canvasInstance.clearRect(image['origX'], image['origY'], image['origWidth']+3, image['origHeight']+3);

        canvasInstance.drawImage(imageElement, image['origX'], image['origY'], image['origWidth'], image['origHeight']);

        canvasInstance.fill();
        canvasInstance.closePath();

        canvasInstance.restore(); //Restores those states.
      
    },

    animate() {

      var incrementer = this.$store.getters.getRotation-90;
      var canvasInstance = this.$store.getters.getCanvas;

      var rectangle = this.$store.getters.getRectangle;
      var images = this.$store.getters.getImages;
      var imageElements = this.$store.getters.getImageElements;

      var timer = d3.interval(() => {
        
        this.drawRect(canvasInstance, rectangle, incrementer);
        this.drawImages(canvasInstance, images[0], incrementer, imageElements[0]);
        this.drawImages(canvasInstance, images[1], incrementer, imageElements[1]);

        if(incrementer == this.$store.getters.getRotation) {
          timer.stop();
        }
        incrementer++;

      }, 20);

    },

    clearFrames() {
      //this.$store.dispatch('clearFrames', 90);
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
