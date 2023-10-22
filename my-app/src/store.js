import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './reduxSlice/userInfoSlice';
import personalReducer from './reduxSlice/personalInfoSlice';
import friendBoxReducer from './reduxSlice/friendBoxInfoSlice';
import fullContactReducer from './reduxSlice/fullContactSlice';
import unreadContactReducer from './reduxSlice/unreadContactSlice';

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    personalInfo: personalReducer,
    friendBoxInfo: friendBoxReducer,
    fullContact: fullContactReducer,
    unreadContact: unreadContactReducer
  }
});

export default store;
