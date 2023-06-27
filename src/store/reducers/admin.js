import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userList: [],
    tenantId: "",
    tenantCompanyName:"",
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        updateList: (state, action) => {
            return {
                ...state,
                userList: [
                  ...state.userList,          
                 action.payload,
                ]
              }; 
        },
        updateTenantId: (state, action) => {
            return {
               tenantId: action.payload.tenantId,
               tenantCompanyName: action.payload.tenantCompanyName
              }; 
        },
    },
})
// Action creators are generated for each case reducer function
export const { updateList, updateTenantId } = adminSlice.actions

export default adminSlice.reducer