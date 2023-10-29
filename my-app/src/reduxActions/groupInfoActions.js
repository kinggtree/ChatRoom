import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchGroupInfo=createAsyncThunk(
  'groupInfo',
  async (groups)=>{
    const response=await axios.post('/api/getGroupInfo', {'groups': groups});
    return response.data;
  }
);