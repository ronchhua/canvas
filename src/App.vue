<template>
  <div id="app">
    <RotateButton/>
    <div class = "item">{{hoverText}}</div>
    <canvas id = "canvas-container" v-on:mousemove="checkMouseHover" width="600" height="600"></canvas>
    <img src="./assets/tiger-Siberian.jpg" id="tigerImage" width="30" height="20" style="display: none;">           <!-- Images need to be rendered before being accessed by canvas-->
    <img src="./assets/hearthstone-best-cards.jpg" id="hearthstoneImage" width="30" height="20" style="display: none;">   <!-- So we load them in first and hide them-->
  </div>
</template>

<script>

import RotateButton from './components/RotateButton.vue';

export default {


  name: 'App',
  components: {
    RotateButton
  },

  data() {
    return {
      hoverText: "Nothing hovered over",
      canvas: null,
      mouse: {
        x: null,
        y: null,
      },
      rectangle: null,

      circle: null,
      
      images: null,

    }
  },

  mounted() {

    this.rectangle = this.$store.getters.getRectangle;
    this.circle = this.$store.getters.getCircle;
    this.images = this.$store.getters.getImages;

    var htmlElement = document.getElementById("canvas-container");
    var drawingContext = htmlElement.getContext("2d");
    this.canvas = drawingContext;

    this.$store.dispatch('setCanvas', this.canvas);

    this.drawRectangle();
    this.drawCircle();

    var tigerImage = document.getElementById("tigerImage");
    tigerImage.addEventListener('load', () => {
      this.canvas.drawImage(tigerImage, this.images[0].x, this.images[0].y, this.images[0].width, this.images[0].height);
    });

    var hearthstoneImage = document.getElementById("hearthstoneImage");
    hearthstoneImage.addEventListener('load', () => {
      this.canvas.drawImage(hearthstoneImage, this.images[1].x, this.images[1].y, this.images[1].width, this.images[1].height);
    });
    
    this.canvas.stroke();

  },

  methods: {

    checkMouseHover(event) {

      this.mouse['x'] = event.offsetX;
      this.mouse['y'] = event.offsetY;

      if(this.inRectangle(event)) {
        this.hoverText = "Rectangle";
      }
      else if(this.inCircle(event)) {
        this.hoverText = "Circle";
      }
      else {
        this.hoverText = this.inImages(event);
      }

    },

    drawRectangle() {
      this.canvas.beginPath();              // Use this to separate shapes
      this.canvas.fillStyle = '#FFA500';    // Sets the rectangle insides orange
      this.canvas.rect(this.rectangle['x'], this.rectangle['y'], this.rectangle['width'], this.rectangle['height']);
      this.canvas.fill();
      this.canvas.closePath();
    },

    drawCircle() {
      this.canvas.beginPath();
      this.canvas.fillStyle = '#FFA500';
      this.canvas.arc(this.circle['x'], this.circle['y'], this.circle['radius'], 0, 2*Math.PI);
      this.canvas.fill();
      this.canvas.closePath();
    },

    inRectangle(event) {
      
      var rectangleX = this.rectangle['x'];
      var rectangleY = this.rectangle['y'];
      var rectangleX2 = this.rectangle['x'] + this.rectangle['width'];
      var rectangleY2 = this.rectangle['y'] + this.rectangle['height'];

      if(event.offsetX >= rectangleX && event.offsetX <= rectangleX2 && event.offsetY >= rectangleY && event.offsetY <= rectangleY2) {
        return true;
      }
      else{
        return false;
      }

    },

    inCircle(event) {

      var xDistance = (event.offsetX - this.circle['x']);
      var yDistance = (event.offsetY - this.circle['y']);
      var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

      if(distance <= this.circle['radius']) {
        return true;
      }
      else{
        return false;
      }
    },

    inImages(event){

      
      for(var i = 0; i < this.images.length; i++) {

        var imageX = this.images[i].x;
        var imageY = this.images[i].y;
        var imageX2 = this.images[i].x + this.images[i].width;
        var imageY2 = this.images[i].y + this.images[i].height;

        if(event.offsetX >= imageX && event.offsetX <= imageX2 && event.offsetY >= imageY && event.offsetY <= imageY2) {
          return this.images[i].imageName;
        }
        
      }

      return "Nothing hovered over";

    }

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

.item {
  border: 3px solid black;
  width: 600px;
  height: 50px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 25px;  /* Get rid of this for no space separating the text and canvas*/
  text-align: left;
  vertical-align: middle;
}

#canvas-container {
  /*width: 600px;     Specify in HTML to get accurate pixel values
  height: 600px;
  */
  border: 3px solid black;
}
</style>
