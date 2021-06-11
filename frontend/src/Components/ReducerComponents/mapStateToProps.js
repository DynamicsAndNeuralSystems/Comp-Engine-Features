const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        ...state
    }
}
export default mapStateToProps