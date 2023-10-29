import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchFullGroupInfo = createAsyncThunk(
  'fullGroupInfo',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/getFullGroupInfo', { groupId });
      const group = response.data;

      const initialMembers = {};
      if (Array.isArray(group.groupMembers)) {
        group.groupMembers.forEach(person => {
          initialMembers[person._id] = { 'name': person.name, 'profilePictureURL': person.profilePictureURL };
        });
      }

      const fullGroupInfo = {
        _id: group._id,
        groupName: group.groupName,
        groupOwnerId: group.groupOwnerId,
        groupMembers: initialMembers,
        groupProfilePictureURL: group.groupProfilePictureURL,
        groupIntro: group.group_intro,
        groupNotice: group.group_notice,
      };

      return fullGroupInfo;
    } catch (err) {
      console.error(err);
      return rejectWithValue('Failed to fetch full group info');
    }
  }
);
