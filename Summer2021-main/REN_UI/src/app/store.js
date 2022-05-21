import { configureStore } from '@reduxjs/toolkit';
import nodeReducer from '../features/nodeUpdater/nodeSlice';

export const store = configureStore({
  reducer: {
    node: nodeReducer,
  },
});
