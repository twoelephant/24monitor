import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import common from "../../utils/common";

const NAMESPACE = 'global'

const thelist = [{ id: 2, name: '2 号店' },
{ id: 3, name: '3 号店' },
{ id: 4, name: '4 号店' },
{ id: 5, name: '5 号店' },
{ id: 6, name: '6 号店' },
{ id: 7, name: '7 号店' },
{ id: 8, name: '8 号店' },
{ id: 9, name: '9 号店' },
{ id: 10, name: '10 号店' },
{ id: 11, name: '11 号店' },
{ id: 14, name: '12 号店' },
{ id: 15, name: '13 号店' },
{ id: 16, name: '14 号店' },
{ id: 17, name: '15 号店' },
{ id: 18, name: '16 号店' },
{ id: 19, name: '17 号店' },]
let newlist =  [{ id: 2, name: '2 号店' },
{ id: 3, name: '3 号店' },
{ id: 4, name: '4 号店' },
{ id: 5, name: '5 号店' },
{ id: 6, name: '6 号店' },
{ id: 7, name: '7 号店' },
{ id: 8, name: '8 号店' },
{ id: 9, name: '9 号店' },
{ id: 10, name: '10 号店' },
{ id: 11, name: '11 号店' },
{ id: 14, name: '12 号店' },
{ id: 15, name: '13 号店' },
{ id: 16, name: '14 号店' },
{ id: 17, name: '15 号店' },
{ id: 18, name: '16 号店' },
{ id: 19, name: '17 号店' },]

const slice = createSlice({
    name: NAMESPACE,
    initialState: {
        username: "",
        shopId: thelist,
    },

    reducers: {
        
        upShopId(state, action) {
            console.log(1)
            let k = { id: 1, name: '1 号店' }
            newlist.unshift(k)
            console.log()
            state.shopId =newlist
        }
    },
});

export const { setShopId, upShopId } = slice.actions

export const { reducer } = slice;
