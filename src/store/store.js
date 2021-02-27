import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store( {
    
    //Create a state of some variable
    state: {
        rotation: 0,

        canvas: null,
        imageElements: [],
        rectangle: {  
            x: 50,
            y: 50,
            origX: 50,
            origY: 50,
            center: [100, 137.5],   // (x1 + (x2+width)) / 2
            origWidth: 100,
            origHeight: 175,
            width: 100,
            height: 175,
            maintainedCur: [50, 50],
        },
        // do paint and do the rotate there
        circle: {
            x: 450,
            y: 400,
            origX: 450,
            origY: 400,
            center: [450, 400],
            radius: 50,
        },
        
        images: [
        {
            imageName: 'Tiger',
            x: 250,
            y: 50,
            origX: 250,
            origY: 50,
            center: [375, 150],
            origWidth: 250,
            origHeight: 200,
            width: 250,
            height: 200,
            maintainedCur: [250, 50],
        },
        {
            imageName: 'Hearthstone', 
            x: 50,
            y: 300,
            origX: 50,
            origY: 300,
            center: [175, 400],
            origWidth: 250,
            origHeight: 200,
            width: 250,
            height: 200,
            maintainedCur: [50, 300],
        }
        ],
    },

    //Create functions that can modify these states 
    mutations: {  

        rotateClockwise (state, degrees) {
            state.rotation += degrees;
        },

        updateCoordinates (state) {

            state.rectangle.x = state.rectangle.maintainedCur[0];
            state.rectangle.y = state.rectangle.maintainedCur[1];

            state.rectangle.x -= state.rectangle.center[0];
            state.rectangle.y -= state.rectangle.center[1];

            state.images.forEach((image) => {

                image.x = image.maintainedCur[0];
                image.y = image.maintainedCur[1];

                image.x -= image.center[0];
                image.y -= image.center[1];
            });

            var finalCoords = [];
            var elements = [];
          
            var convertedRadians = 90 * (Math.PI / 180);   // Rotate 359->270


            var rotatedX = state.rectangle.x*Math.cos(convertedRadians) - state.rectangle.y*Math.sin(convertedRadians);
            var rotatedY = state.rectangle.x*Math.sin(convertedRadians) + state.rectangle.y*Math.cos(convertedRadians);
            
            var positionedX = rotatedX+state.rectangle.center[0];
            var positionedY = rotatedY+state.rectangle.center[1];

            elements.push(state.rectangle);
            finalCoords.push([positionedX, positionedY]);

            state.images.forEach((image) => {

                var convertedRadians = 90 * (Math.PI / 180);   // Rotate 359->270

                var rotatedX = image.x*Math.cos(convertedRadians) - image.y*Math.sin(convertedRadians);
                var rotatedY = image.x*Math.sin(convertedRadians) + image.y*Math.cos(convertedRadians);
                
                var positionedX = rotatedX+image.center[0];
                var positionedY = rotatedY+image.center[1];

                elements.push(image);
                finalCoords.push([positionedX, positionedY]);
            
            });
            
            var holder;
            var index = 0;

            switch(state.rotation) {
                case 90:
                    elements.forEach((element) => {
                        element.x = finalCoords[index][0] - element.origHeight;
                        element.y = finalCoords[index][1];
                        
                        holder = element.width;
                        element.width = element.height;
                        element.height = holder;
                        index++;
                    });
                    break;
                case 180:
                    elements.forEach((element) => {
                        element.x = finalCoords[index][0] - element.origWidth;
                        element.y = finalCoords[index][1] - element.origHeight;

                        holder = element.width;             // We basically make the width equal back to the width, that was changed in 90 degree rotation.
                        element.width = element.height;
                        element.height = holder;

                        index++;
                    });
                    break;
                case 270:
                    elements.forEach((element) => {
                        element.x = finalCoords[index][0];
                        element.y = finalCoords[index][1] - element.origWidth;
                        
                        holder = element.width;
                        element.width = element.height;
                        element.height = holder;
                        index++;

                    });
                    break;
                case 360:
                    elements.forEach((element) => {
                        element.x = finalCoords[index][0];
                        element.y = finalCoords[index][1];

                        holder = element.width;             // We basically make the width equal back to the width, that was changed in 270 degree rotation.
                        element.width = element.height;
                        element.height = holder;
                        index++;

                    });
                    break;
            }

            index=0;
            elements.forEach((element) => {
                element.maintainedCur[0] = finalCoords[index][0];
                element.maintainedCur[1] = finalCoords[index][1];
                index++;
            });


            console.log(finalCoords[0][0], finalCoords[0][1]);
            console.log(state.rectangle.x, state.rectangle.y);


        },

        initCanvas(state, canvas) {
            state.canvas = canvas;
        },

        storeImageElements(state, image) {
            state.imageElements.push(image);
        },

        clearPositions(state) {
            for(const point in state.rectangle.cartesianCoords) {
                    
                state.rectangle.frames[point].x = [];
                state.rectangle.frames[point].y = [];

                state.images.forEach((image) => {
                    image.frames[point].x = [];
                    image.frames[point].y = [];

                });

            }
        },
        
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
        },
        clearFrames (context) {
            context.commit('clearPositions');
        },
        addImageElement(context, image) {
            context.commit('storeImageElements', image);
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
        getImageElements (state) {
            return state.imageElements;
        }
    }

});

