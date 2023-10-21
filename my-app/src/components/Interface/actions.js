import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchUserInfo=createAsyncThunk(
  'userInfo',
  async ()=>{
    const response=await axios.post('/api/getUserInfo');
    return response.data;
  }
);