import { combineReducers } from 'redux';
import { itemReducer, itemLoading, itemLoadingError } from '../Containers/Homepage/reducer';

export const rootReducer = combineReducers({
    itemReducer,
    itemLoading,
    itemLoadingError
});

export default rootReducer;

