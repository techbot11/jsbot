import { FETCH_DATA_LOADING_SUCCESS, FETCH_DATA_LOADING_FAILURE, FETCH_DATA_LOADING } from './constants';

export const fetchData = (url) => {
    return (dispatch) => {
        dispatch(fetchDataLoading(true));

        fetch(url)
            .then(response => {
                setTimeout(() => {
                    dispatch(fetchDataLoading(false))
                    return response;
                }, 1000)
            })
            .then(response => response.json())
            .then(items => dispatch(fetchDataSuccess(items)))
            .catch(error => dispatch(fetchDataFailure(error)))
    }

}

export const fetchDataLoading = (status) => {
    return {
        type: FETCH_DATA_LOADING,
        status
    }
}

export const fetchDataSuccess = (data) => {
    return {
        type: FETCH_DATA_LOADING_SUCCESS,
        data
    }
}

export const fetchDataFailure = (status) => {
    return {
        type: FETCH_DATA_LOADING_FAILURE,
        status
    }
}
