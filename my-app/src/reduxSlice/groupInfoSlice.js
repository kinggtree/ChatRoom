import { fetchGroupInfo } from "../reduxActions/groupInfoActions";
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
      .addCase(fetchGroupInfo.pending, state=>{
        state.status='loading';
      })
      .addCase(fetchGroupInfo.fulfilled, (state, action)=>{
        state.status='succeeded';
        state.item=action.payload;
      })
      .addCase(fetchGroupInfo.rejected, (state, action)=>{
        state.status='failed';
        state.error=action.error.message;
      });
  }
});

export default groupInfoSlice.reducer;