import { createSlice } from "@reduxjs/toolkit";
import { initialUnreadContacts } from "../reduxActions/unreadContactActions";

const unreadContactSlice = createSlice({
  name: 'unreadContact',
  initialState: {
    item: {},
    status: 'idle',
    error: null
  },
  reducers: {
    newMessageReceived: (state, action) => {
      const { senderId, messageId } = action.payload;
      if (state.item[senderId]) {
        state.item[senderId].unreadCount += 1;
        state.item[senderId].messageIds.push(messageId);
      } else {
        state.item[senderId] = { 
          unreadCount: 1,
          messageIds: [messageId]
        };
      }
    },
    messageRead: (state, action) => {
      const senderId = action.payload.senderId;
      if(state.item[senderId]){
        state.item[senderId].unreadCount = 0;
        state.item[senderId].messageIds = [];
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(initialUnreadContacts.pending, state => {
        state.status = 'loading';
      })
      .addCase(initialUnreadContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(initialUnreadContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { newMessageReceived, messageRead } = unreadContactSlice.actions;
export default unreadContactSlice.reducer;
