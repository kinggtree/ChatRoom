import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchFriendBoxInfo=createAsyncThunk(
  'chatBoxInfo',
  async (receiverId)=>{
    const response=await axios.post('/api/getFriendBoxInfo', {friendId: receiverId})
    return response.data;
  }
);