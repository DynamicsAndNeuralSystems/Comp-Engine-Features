const mapDispatchToProps = (dispatch) => {
    return {
        addLinkCount: () => dispatch({type: 'ADD_LINK_COUNT'}),
        addFeatures: (features) => dispatch({type: 'ADD_FEATURES', data: features}),
        updateKeywordSearch: (keywordSearch) => dispatch({type: 'UPDATE_KEYWORD_SEARCH', data: keywordSearch}),
        addFeatureToBuffer: (data, name) => dispatch({
            type: 'ADD_FEATURE_DATA_TO_BUFFER',
            data: {res: data, name: name}
        }),
        addTimeseriesToBuffer: (data, name) => dispatch({
            type: 'ADD_TIME_SERIES_TO_BUFFER',
            data: {res: data, name: name}
        }),
        addPopKeywords:(popKeywords) => dispatch({type: 'ADD_POP_KEYWORDS', data: popKeywords}),
    }
}
export default mapDispatchToProps