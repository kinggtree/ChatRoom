import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './reduxSlice/userInfoSlice';
import personalReducer from './reduxSlice/personalInfoSlice';
import friendInfoReducer from './reduxSlice/friendInfoSlice';
import fullContactReducer from './reduxSlice/fullContactSlice';
import unreadContactReducer from './reduxSlice/unreadContactSlice';
import groupInfoReducer from './reduxSlice/groupInfoSlice';

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    personalInfo: personalReducer,
    friendInfo: friendInfoReducer,
    fullContact: fullContactReducer,
    unreadContact: unreadContactReducer,
    groupInfo: groupInfoReducer
  }
});

export default store;
