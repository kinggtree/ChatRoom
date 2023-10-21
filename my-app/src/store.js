import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './userInfoSlice';
import personalReducer from './personalInfoSlice';
import friendBoxReducer from './friendBoxInfoSlice';

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    personalInfo: personalReducer,
    friendBoxInfo: friendBoxReducer
  },
});

export default store;
