import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import themeReducer from "./theme/themeSlice";
import authReducer from "./auth/authSlice";
import { userApiSlice } from "./api/usersApiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  auth: authReducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      userApiSlice.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
