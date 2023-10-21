import { fetchFriendBoxInfo } from '../reduxActions/friendBoxActions';
import { createSlice } from "@reduxjs/toolkit";

const friendBoxSlice=createSlice({
  name: 'chatBoxInfo',
  initialState:{
    item:{},
    status:'idle',
    error: null
  },
  extraReducers: builder=>{
    builder
      .addCase(fetchFriendBoxInfo.pending, state=>{
        state.status='loading';
      })
      .addCase(fetchFriendBoxInfo.fulfilled, (state, action)=>{
        state.status='succeeded';
        state.item=action.payload;
      })
      .addCase(fetchFriendBoxInfo.rejected, (state, action)=>{
        state.status='failed';
        state.error=action.error.message;
      });
  }
});

export default friendBoxSlice.reducer;