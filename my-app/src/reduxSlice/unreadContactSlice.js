import { createSlice } from "@reduxjs/toolkit";

const unreadContactSlice=createSlice({
  name: 'unreadContact',
  initialState: {},
  reducers: {
    initialUnreadContact: (state, action)=>{
      const contactIds=action.payload;
      console.log(action.payload);
      contactIds.map(item=>{
        state[item.contactId]={
          unreadCount: 0,
          messageIds: []
        }
      });
    },
    newMessageReceived: (state, action)=>{
      const senderId=action.payload.senderId;
      const messageId=action.payload.messageId;
      if (state[senderId]) {
        state[senderId].unreadCount += 1;
        state[senderId].messageIds.push(messageId);
      } else {
        state[senderId] = { 
          unreadCount: 1,
          messageIds: [messageId]
        };
      }
    },
    
    messageRead: (state, action)=>{
      const senderId=action.payload.senderId;
      if(state[senderId]){
        state[senderId].unreadCount=0;
        // clear arr
        state[senderId].messageIds.length=0;
      }
    }
  },
});

export const {newMessageReceived, messageRead}=unreadContactSlice.actions;
export default unreadContactSlice.reducer;