import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './reduxSlice/userInfoSlice';
import personalReducer from './reduxSlice/personalInfoSlice';
import friendBoxReducer from './reduxSlice/friendBoxInfoSlice';
import fullContactReducer from './reduxSlice/fullContactSlice';

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    personalInfo: personalReducer,
    friendBoxInfo: friendBoxReducer,
    fullContact: fullContactReducer
  },
});

export default store;
