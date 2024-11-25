import { createSlice } from "@reduxjs/toolkit";


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    // partNumberDetail: [],
    // partNumberIsLoading: false,
   
  },
  reducers: {
    // partNumberReducer: (state, { payload }) => {
    //   const { apiData, isLoading } = payload;
    //   state.partNumberDetail = apiData;
    //   state.partNumberIsLoading = isLoading;
    // },
   
  },
});

// export const { partNumberReducer } = adminSlice.actions;

export const adminSelector = (state) => state.admin;
export const adminReducer = adminSlice.reducer;
