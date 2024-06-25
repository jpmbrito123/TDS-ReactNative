import {configureStore} from '@reduxjs/toolkit';

import userReducer from './src/Slices/sliceUser';
import appReducer from './src/Slices/sliceApp'

export default configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,

  },
});

