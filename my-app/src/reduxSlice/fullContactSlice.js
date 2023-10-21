import { createSlice } from "@reduxjs/toolkit";
import { fetchFullContact } from '../reduxActions/fullContactActions';

const fullContactSlice=createSlice({
  name: 'fullContact',
  initialState:{
    item: {},
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder=>{
    builder
      .addCase(fetchFullContact.pending, state=>{
        state.status='loading';
      })
      .addCase(fetchFullContact.fulfilled, (state, action)=>{
        state.status='succeeded';
        state.item=action.payload;
      })
      .addCase(fetchFullContact.rejected, (state,action)=>{
        state.status='failed';
        state.error=action.error.message;
      });
  }
});

export default fullContactSlice.reducer;



