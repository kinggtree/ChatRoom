import { createAsyncThunk } from '@reduxjs/toolkit';

export const initialUnreadContacts = createAsyncThunk(
  'unreadContact/initialUnreadContacts',
  async (contactIds) => {
    const initialState = {};
    contactIds.forEach(id => {
      initialState[id] = { unreadCount: 0, messageIds: [] };
    });
    return initialState;
  }
);
