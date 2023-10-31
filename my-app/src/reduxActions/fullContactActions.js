import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchFullContact=createAsyncThunk(
  'fullContact',
  async (contactIds)=>{
    let contactIdsArr=[];
    await contactIds.forEach(item=>{
      contactIdsArr.push(item.contactId);
    });
    const response=await axios.post('/api/fullContact', {'contactIds': contactIdsArr});
    return response.data;
  }
);