import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store( {
    
    //Create a state of some variable
    state: {
        rotation: 0,

        canvas: null,

        rectangle: {    // (50 - 75, 137.5-50) => (-25, 87.5) is the new (x,y) with respect to center (0,0)
            x: 50,
            y: 50,
            coordinates: {
                topLeft: [50, 50],
                topRight: [150, 50],
                bottomLeft: [50, 225],
                bottomRight: [150, 225],
            },
            center: [100, 137.5],
            prevX: null,
            prevY: null,
            cartesianCoords: {
                topLeft: [50-100, 225-137.5],       // This is basically the bottomLeft - offset.
                topRight: [150-100, 225-137.5],     // This is bottomRight - offset.
                bottomLeft: [50-100, 50-137.5],     // This is topLeft - offset.
                bottomRight: [150-100, 50-137.5],   // This is topRight - offset.
            },
            cartesianCenter: [100, -37.5],
            framesX: [],
            framesY: [],
            width: 100,
            height: 175,
        },
        // do paint and do the rotate there
        circle: {
            x: 450,
            y: 400,
            prevX: null,
            prevY: null,
            center: [450, 400],
            radius: 50,
        },
        
        images: [
        {
            imageName: 'Tiger',
            x: 250,
            y: 50,
            x2: 550,
            y2: 250,
            prevX: null,
            prevY: null,
            center: [400, 150],
            width: 300,
            height: 200,
        },
        {
            imageName: 'Hearthstone', 
            x: 50,
            y: 300,
            x2: 350,
            y2: 500,
            prevX: null,
            prevY: null,
            center: [200, 400],
            width: 300,
            height: 200,
        }
        ],
    },

    //Create functions that can modify these states 
    mutations: {    
        rotateClockwise (state, degrees) {
            state.rotation += degrees;
        },
        updateCoordinates (state) {

            for(var i = 1; i <= state.rotation; i++) {
          
            //for(const coord in state.rectangle.cartesianCoords) {


                var convertedRadians = (360-i) * (Math.PI / 180);   // Rotate 359->270
                    //var convertedRadians = (360-state.rotation) * (Math.PI / 180); // 200,75

                    var rotatedX = state.rectangle.cartesianCoords['topLeft'][0]*Math.cos(convertedRadians) - state.rectangle.cartesianCoords['topLeft'][1]*Math.sin(convertedRadians);
                    var rotatedY = state.rectangle.cartesianCoords['topLeft'][0]*Math.sin(convertedRadians) + state.rectangle.cartesianCoords['topLeft'][1]*Math.cos(convertedRadians);
                    
                    var positionedX = rotatedX+state.rectangle.center[0];
                    var positionedY = rotatedY+state.rectangle.center[1];

                    //console.log(positionedX, positionedY);

                    
                    //state.canvas.beginPath();              // Use this to separate shapes
                    //state.canvas.fillStyle = '#FF00FF';    // Sets the rectangle insides orange
                    //state.canvas.rect(positionedX, positionedY - (state.rectangle.width), state.rectangle.height, state.rectangle.width);
                    //state.canvas.fill();
                    //state.canvas.closePath();
                    
                    console.log(positionedX, positionedY - (state.rectangle.width));
                    state.rectangle.framesX.push(positionedX);
                    state.rectangle.framesY.push(positionedY - (state.rectangle.width));

            }

            //}
 
        },
        initCanvas(state, canvas) {
            state.canvas = canvas;
        }
    },

    //Calls mutations asynchronously, mutations occur synchronously
    actions: {
        rotateAction (context, degrees) {
            if(this.state.rotation == 360) {
                this.state.rotation = 0;
            }
            context.commit('rotateClockwise', degrees);
        },
        setCanvas (context, canvas) {
            context.commit('initCanvas', canvas);
        },

        updateElements (context) {
            context.commit('updateCoordinates');
        }
    },

    //Gets values of states.
    getters: {
        getRotation (state) {
            return state.rotation;
        },
        getRectangle (state) {
            return state.rectangle;
        },
        getCircle (state) {
            return state.circle;
        },
        getImages (state) {
            return state.images;
        },
        getCanvas (state) {
            return state.canvas;
        },
    }

});

