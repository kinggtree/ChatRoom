import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchFriendInfo=createAsyncThunk(
  'friendInfo',
  async (receiverId)=>{
    const response=await axios.post('/api/getFriendInfo', {friendId: receiverId})
    return response.data;
  }
);