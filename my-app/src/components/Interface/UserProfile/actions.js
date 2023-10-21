import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// action
export const fetchPersonalInfo=createAsyncThunk(
  'personalInfo',
  async ()=>{
    const response=await axios.post('/api/personalProfile');
    return response.data;
  }
);
