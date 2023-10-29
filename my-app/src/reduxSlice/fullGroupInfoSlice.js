import { createSlice } from "@reduxjs/toolkit";
import { fetchFullGroupInfo } from "../reduxActions/fullGroupInfoActions";

const fullGroupInfoSlice=createSlice({
  name: 'fullGroupInfo',
  initialState:{
    item: {},
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder=>{
    builder
      .addCase(fetchFullGroupInfo.pending, state=>{
        state.status='loading';
      })
      .addCase(fetchFullGroupInfo.fulfilled, (state, action)=>{
        state.status='succeeded';
        state.item=action.payload;
      })
      .addCase(fetchFullGroupInfo.rejected, (state,action)=>{
        state.status='failed';
        state.error=action.error.message;
      });
  }
});

export default fullGroupInfoSlice.reducer;



