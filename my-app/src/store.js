import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './reduxSlice/userInfoSlice';
import personalReducer from './reduxSlice/personalInfoSlice';
import friendBoxReducer from './reduxSlice/friendBoxInfoSlice';
import fullContactReducer from './reduxSlice/fullContactSlice';
import unreadContactReducer from './reduxSlice/unreadContactSlice';
import sseMiddleware from './middleware/sseMiddleware';

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    personalInfo: personalReducer,
    friendBoxInfo: friendBoxReducer,
    fullContact: fullContactReducer,
    unreadContact: unreadContactReducer
  },
  middleware: getDefaultMiddleware=>getDefaultMiddleware().concat(sseMiddleware)
});

export default store;
