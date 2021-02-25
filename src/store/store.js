import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store( {
    
    //Create a state of some variable
    state: {
        rotation: 0,
    },

    //Create functions that can modify these states 
    mutations: {    
        rotateClockwise (state, degrees) {
            state.rotation += degrees;
        },
    },

    //Calls mutations asynchronously, mutations occur synchronously
    actions: {
        rotateAction (context, degrees) {
            context.commit('rotateClockwise', degrees);
        },
    },

    //Gets values of states.
    getters: {
        getRotation (state) {
            return state.rotation;
        },
    }

});

