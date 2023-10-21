import { createSlice } from "@reduxjs/toolkit";
import { fetchPersonalInfo } from '../reduxActions/personalInfoActions';


// slice (reducer)
const personalInfoSlice=createSlice({
  name: 'personalInfo',
  initialState:{
    item:{},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder=>{
    builder
      .addCase(fetchPersonalInfo.pending, state=>{
        state.status='loading';
      })
      .addCase(fetchPersonalInfo.fulfilled, (state, action)=>{
        state.status='succeeded';
        state.item=action.payload;
      })
      .addCase(fetchPersonalInfo.rejected, (state,action)=>{
        state.status='failed';
        state.error=action.error.message;
      });
  }
});

export default personalInfoSlice.reducer;