import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { adminReducer } from "./slice/adminSlice";


const rootReducer = combineReducers({
  admin: adminReducer,
});

const Store = configureStore({ reducer: rootReducer });
export default Store;
