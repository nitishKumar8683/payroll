import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice'; 

const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  });
};

export default makeStore;
