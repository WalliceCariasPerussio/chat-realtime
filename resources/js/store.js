import vue from "vue";
import Vuex from "vuex"
import cretePersistedState from 'vuex-persistedstate'

export default new Vuex.Store({
    state:{
        user: {}
    },
    mutations:{
        setUserState: (state, value) => state.user = value
    },
    actions:{
        userStateAction: ({commit}) => {
            axios.get(`api/user/me`).then(r => {
                commit('setUserState',r.data.user);
            });
        }
    },
    plugins:[cretePersistedState() ]
});
