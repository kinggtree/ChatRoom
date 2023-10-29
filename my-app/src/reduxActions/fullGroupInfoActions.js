import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchFullGroupInfo=createAsyncThunk(
  'fullGroupInfo',
  async (groupId)=>{
    const response=await axios.post('/api/getFullGroupInfo', {'groupId': groupId});
    return response.data;
  }
);
