import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo } from "./components/Interface/actions";

//slice (reducer)
const userInfoSlice=createSlice({
  name: 'userInfo',
  initialState:{
    item: {},
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder =>{
    builder
      .addCase(fetchUserInfo.pending, state=>{
        state.status='loading';
      })
      .addCase(fetchUserInfo.fulfilled, (state, action)=>{
        state.status='succeeded';
        state.item=action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state,action)=>{
        state.status='failed';
        state.error=action.error.message;
      });
  }
});

export default userInfoSlice.reducer;