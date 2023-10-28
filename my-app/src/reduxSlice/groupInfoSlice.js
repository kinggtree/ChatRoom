import { fetchFriendInfo } from '../reduxActions/friendActions';
import { createSlice } from "@reduxjs/toolkit";

const groupInfoSlice=createSlice({
  name: 'groupInfo',
  initialState:{
    item:{},
    status: 'idle',
    error: null
  },
  extraReducers: builder=>{
    builder
      .addCase(fetchFriendInfo.pending, state=>{
        state.status='loading';
      })
      .addCase(fetchFriendInfo.fulfilled, (state, action)=>{
        state.status='succeeded';
        state.item=action.payload;
      })
      .addCase(fetchFriendInfo.rejected, (state, action)=>{
        state.status='failed';
        state.error=action.error.message;
      });
  }
});

export default groupInfoSlice.reducer;