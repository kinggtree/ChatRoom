import { createSlice } from "@reduxjs/toolkit";

const unreadContactSlice=createSlice({
  name: 'unreadContact',
  initialState: {},
  reducers: {
    newMessageReceived: (state, action)=>{
      const senderId=action.payload;
      if (state[senderId]) {
        state[senderId].unreadCount += 1;
      } else {
        state[senderId] = { unreadCount: 1 };
      }
    },
    
    messageRead: (state, action)=>{
      const senderId=action.payload;
      if(state[senderId]){
        state[senderId].unreadCount=0;
      }
    }
  },
});

export const {newMessageReceived, messageRead}=unreadContactSlice.actions;
export default unreadContactSlice.reducer;