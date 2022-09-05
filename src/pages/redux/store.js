import {combineReducers} from 'redux'
import {configureStore} from '@reduxjs/toolkit'

import {reducer as globalReducer} from './global'

const reducers = combineReducers({
    global: globalReducer,
})

const store = configureStore({
    reducer: reducers,
    devTools: process.env.NODE_ENV !== 'production',
});

export default store
