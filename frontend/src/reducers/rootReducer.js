const initstate = {
    linkCount: 1,
    lorem: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    url: 'http://127.0.0.1:8000/',
    // url: 'https://www.comp-engine-features.org/api/',
    features: null,
    fid: "",
    fname: "",
    featureBuffer: {},
    timeseriesBuffer: {},
    keywordSearch: false,
    popKeywords: []
}


const rootReducer = (state = initstate, action) => {
    if (action.type === 'ADD_LINK_COUNT') {
        state.linkCount = state.linkCount + 1
            return {
            ...state,
        }
    }
    if (action.type === "ADD_FEATURES") {
        return {
            ...state,
            features: action.data
        }
    }
    if (action.type === "UPDATE_KEYWORD_SEARCH") {
        return {
            ...state,
            keywordSearch: action.data
        }
    }
    if(action.type === "ADD_FEATURE_DATA_TO_BUFFER"){
        state.featureBuffer[action.data.name] = action.data.res
        return {
            ...state
        }
    }
    if(action.type === "ADD_TIME_SERIES_TO_BUFFER"){
        state.timeseriesBuffer[action.data.name] = action.data.res
        return {
            ...state
        }
    }
    if(action.type === "ADD_POP_KEYWORDS"){
        state.popKeywords = action.data
        return {
            ...state
        }
    }
    return state
}

export default rootReducer