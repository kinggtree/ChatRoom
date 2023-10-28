import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchGroupInfo=createAsyncThunk(
  'groupInfo',
  async ()=>{
    const response=await axios.post('/api/getGroupInfo');
    return response.data;
  }
);