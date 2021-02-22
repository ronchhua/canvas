<template>
  <div id="app">
    <div class = "item">{{hoverText}}</div>
    <canvas id = "canvas-container" v-on:mousemove="checkMouseHover" width="600" height="600"></canvas>
    <img src="./assets/tiger-Siberian.jpg" id="tigerImage" width="30" height="20" style="display: none;">           <!-- Images need to be rendered before being accessed by canvas-->
    <img src="./assets/hearthstone-best-cards.jpg" id="hearthstoneImage" width="30" height="20" style="display: none;">   <!-- So we load them in first and hide them-->
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },

  data() {
    return {
      hoverText: "Nothing hovered over",
      canvas: null,
      mouse: {
        x: null,
        y: null,
      },
      rectangle: {
        x: 50,
        y: 50,
        width: 100,
        height: 175,
      },
      circle: {
        x: 450,
        y: 400,
        radius: 50,
      },
      tigerImage: {
        x: 250,
        y: 50,
        width: 300,
        height: 200,
      },
      hearthstoneImage: {
        x: 50,
        y: 300,
        width: 300,
        height: 200,
      },
    }
  },

  mounted() {
    var htmlElement = document.getElementById("canvas-container");
    var drawingContext = htmlElement.getContext("2d");
    this.canvas = drawingContext;

    this.drawRectangle();
    this.drawCircle();
  
  
    var tigerImage = document.getElementById("tigerImage");
    tigerImage.addEventListener('load', () => {
      this.canvas.drawImage(tigerImage, this.tigerImage['x'], this.tigerImage['y'], this.tigerImage['width'], this.tigerImage['height']);
    });

    var hearthstoneImage = document.getElementById("hearthstoneImage");
    hearthstoneImage.addEventListener('load', () => {
      this.canvas.drawImage(hearthstoneImage, this.hearthstoneImage['x'], this.hearthstoneImage['y'], this.hearthstoneImage['width'], this.hearthstoneImage['height']);
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
      else if(this.inTigerImage(event)) {
        this.hoverText = "Tiger";
      }
      else if(this.inHSImage(event)) {
        this.hoverText = "Hearthstone";
      }
      else {
        this.hoverText = "Nothing hovered over";
      }

    },

    drawRectangle() {
      this.canvas.beginPath();              // Use this to separate shapes
      this.canvas.fillStyle = '#FFA500';    // Sets the rectangle insides orange.
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

    inTigerImage(event) {

      var tigerX = this.tigerImage['x'];
      var tigerY = this.tigerImage['y'];
      var tigerX2 = this.tigerImage['x'] + this.tigerImage['width'];
      var tigerY2 = this.tigerImage['y'] + this.tigerImage['height'];

      if(event.offsetX >= tigerX && event.offsetX <= tigerX2 && event.offsetY >= tigerY && event.offsetY <= tigerY2) {
        return true;
      }
      else{
        return false;
      }
    },

    inHSImage(event){

      var hearthstoneX = this.hearthstoneImage['x'];
      var hearthstoneY = this.hearthstoneImage['y'];
      var hearthstoneX2 = this.hearthstoneImage['x'] + this.hearthstoneImage['width'];
      var hearthstoneY2 = this.hearthstoneImage['y'] + this.hearthstoneImage['height'];

      if(event.offsetX >= hearthstoneX && event.offsetX <= hearthstoneX2 && event.offsetY >= hearthstoneY && event.offsetY <= hearthstoneY2) {
        return true;
      }
      else{
        return false;
      }

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
