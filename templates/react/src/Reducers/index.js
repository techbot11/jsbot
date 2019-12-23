import { combineReducers } from 'redux';
import { itemReducer, itemLoading, itemLoadingError } from '../Components/home/reducer';

export const rootReducer = combineReducers({
    itemReducer,
    itemLoading,
    itemLoadingError
});

export default rootReducer;

