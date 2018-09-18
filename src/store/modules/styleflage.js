const styleflage = {
    state: {
        navSm:false,
        navStyle:'1',
    },
    mutations: {
        getNavFlag:(state,navSm) => {
            state.navSm = navSm;
        },
        getNavStyle:(state,navStyle) => {
            state.navStyle = navStyle;
        }
    },
    actions: {
        getNavFlag({commit},navSm){
            commit('getNavFlag',navSm);
        },
        getNavStyle({commit},navStyle){
            commit('getNavStyle',navStyle);
        },
    }

}


export default styleflage