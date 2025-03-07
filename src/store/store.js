import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/authSlice.js'
import userReducer from '../features/userSlice.js'
import messageReducer from '../features/messageSlice.js'
import friendReducer from '../features/friendSlice.js'

const store =configureStore({
  reducer: {
    auth:authReducer,
    user: userReducer,
    message: messageReducer,
    friend: friendReducer,
  },
});

export default store;