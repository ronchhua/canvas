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
            origX: 50,              // Keep a state representing the original coordinates on the canvas. Used for animating rotation.
            origY: 50,
            center: [100, 137.5],   // (x1 + (x1+width)) / 2  -  (y1 + (y1+height)) / 2

            origWidth: 100,         // Keep a state representing the original width and height 
            origHeight: 175,        // because height and width are modified to correctly allow for bound detection in App.vue and so that we have a state (coordinates) represented by the rotating object.
            width: 100,             
            height: 175,
            rotatedCoord: [50, 50],    // This is necessary to maintain the top-left corner as it rotates. We need to maintain it because we overwrite 'x' and 'y'
                                        // so that when we call updateCoordinates(), we can get the proper Cartesian version of the coordinates and use it for calculations.
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
            rotatedCoord: [250, 50],
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
            rotatedCoord: [50, 300],
        }
        ],
    },

    //Create functions that can modify these states 
    mutations: {  

        rotateClockwise (state, degrees) {
            state.rotation += degrees;
        },

        updateCoordinates (state) {

            state.rectangle.x = state.rectangle.rotatedCoord[0];   // Set the x value to the previous calculated rotated x-coord
            state.rectangle.y = state.rectangle.rotatedCoord[1];   // Set the y value to the previous calculated rotated y-coord

            state.rectangle.x -= state.rectangle.center[0];         // Now take the canvas's coordinate plane and offset it to match the cartesian plane
            state.rectangle.y -= state.rectangle.center[1];         // For both x and y coordinates.

            state.images.forEach((image) => {              // Do the same for the images like I did for rectangle.

                image.x = image.rotatedCoord[0];
                image.y = image.rotatedCoord[1];

                image.x -= image.center[0];
                image.y -= image.center[1];
            });

            var finalCoords = [];   // Store the computed rotated coordinate (the canvas' coordinate) after applying a rotation of 90 degrees.
            var elements = [];      // Just used to hold the rectangle and images in an array, so that I don't have to keep separating their calculations.
          
            var convertedRadians = 90 * (Math.PI / 180);   // Convert the angle we are rotating by to radians.


            var rotatedX = state.rectangle.x*Math.cos(convertedRadians) - state.rectangle.y*Math.sin(convertedRadians);     // Apply the rotation
            var rotatedY = state.rectangle.x*Math.sin(convertedRadians) + state.rectangle.y*Math.cos(convertedRadians);
            
            var positionedX = rotatedX+state.rectangle.center[0];   // Convert x and y back into canvas' coordinate values
            var positionedY = rotatedY+state.rectangle.center[1];

            elements.push(state.rectangle);                 // Add rectangle into our array, could have done it way earlier.
            finalCoords.push([positionedX, positionedY]);   // Save the correct canvas' coordinates for the rotation on (x,y) 

            state.images.forEach((image) => {       // Do the same for all our images like we did for rectangle

                var convertedRadians = 90 * (Math.PI / 180);   // Rotate 359->270

                var rotatedX = image.x*Math.cos(convertedRadians) - image.y*Math.sin(convertedRadians);
                var rotatedY = image.x*Math.sin(convertedRadians) + image.y*Math.cos(convertedRadians);
                
                var positionedX = rotatedX+image.center[0];
                var positionedY = rotatedY+image.center[1];

                elements.push(image);
                finalCoords.push([positionedX, positionedY]);
            
            });
            
            var holder;     // A temp variable used to hold the width value before overwriting and writing to the height
            var index = 0;  // Iterator for the coordinates in finalCoords

            /* The intuition behind each case is that, for rectangle and the images, we only maintain 1 point that represents their placement on the canvas
            *  and that is always the top left point of each element. So when we do a rotation, we need to change (x,y) such that our "abstract" rectangle
            *  (necessary for detecting mouse hovers) is properly interpreted by the inRect() and inImages() function so that we can detect the hovering on
            *  the rotated elements as shown on the canvas. In those methods, we always assumed a top-left coordinate and check if the mouse is in that bound
            *  of the top-left coordinate and the width and height.
            */

            switch(state.rotation) {
                case 90:    // If current rotation is 90
                    elements.forEach((element) => {
                        element.x = finalCoords[index][0] - element.origHeight;     // Modify the rectangle and images' (x,y) such that they are always appear as the top-left angle of the shape. 
                        element.y = finalCoords[index][1];                          // This is necessary because we can only draw rectangles starting from a (x,y) that represents the top left. And we use width and height to change the size of the retangle.
                        
                        holder = element.width;                     // For a 90 degree rotation, we will be swapping the height and width so that
                        element.width = element.height;             // when (x,y) is positioned correctly, and the rectangle is rotated to 90 degree, the height represents the sideway rectangle's width.
                        element.height = holder;
                        index++;
                    });
                    break;
                case 180:   // If current rotation is 180
                    elements.forEach((element) => {                                 
                        element.x = finalCoords[index][0] - element.origWidth;      
                        element.y = finalCoords[index][1] - element.origHeight;

                        holder = element.width;             // We basically make the width equal back to the width, that was changed in 90 degree rotation.
                        element.width = element.height;
                        element.height = holder;

                        index++;
                    });
                    break;
                case 270:   // If current rotation is 270
                    elements.forEach((element) => {
                        element.x = finalCoords[index][0];
                        element.y = finalCoords[index][1] - element.origWidth;
                        
                        holder = element.width;
                        element.width = element.height;
                        element.height = holder;
                        index++;

                    });
                    break;
                case 360:   // If current rotation is 360 (0)
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
                element.rotatedCoord[0] = finalCoords[index][0];        // We store each element's rotated coordinate on the canvas
                element.rotatedCoord[1] = finalCoords[index][1];
                index++;
            });


            //console.log(finalCoords[0][0], finalCoords[0][1]);
            //console.log(state.rectangle.x, state.rectangle.y);


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

