import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    addNewEmployeeDetail: [],
    addNewEmployeeIsLoading: false,
    searchEmployeeDetail: [],
    searchEmployeeIsLoading: false,
    updateEmployeeDetail: [],
    updateEmployeeIsLoading: false,
    getAllEmployeeDetail: [],
    getAllEmployeeDetailIsLoading: false,
    updateCycleGamesDetail: [],
    updateCycleGamesIsLoading: false,
    signVerifyDetail: [],
    signVerifyIsLoading: false
  },
  reducers: {
    addNewEmployeeReducer: (state, { payload }) => {
      const { apiData, isLoading } = payload;
      state.addNewEmployeeDetail = apiData;
      state.addNewEmployeeIsLoading = isLoading;
    },
    searchEmployeeReducer: (state, { payload }) => {
      const { apiData, isLoading } = payload;
      state.searchEmployeeDetail = apiData;
      state.searchEmployeeIsLoading = isLoading;
    },
    updateEmployeeDetailReducer: (state, { payload }) => {
      const { apiData, isLoading } = payload;
      state.updateEmployeeDetail = apiData;
      state.updateEmployeeIsLoading = isLoading;
    },
    getAllEmployeeDetailReducer: (state, { payload }) => {
      const { apiData, isLoading } = payload;
      state.getAllEmployeeDetail = apiData;
      state.getAllEmployeeDetailIsLoading = isLoading;
    },
    updateCycleGamesReducer: (state, { payload }) => {
      const { apiData, isLoading } = payload;
      state.updateCycleGamesDetail = apiData;
      state.updateCycleGamesIsLoading = isLoading;
    },
    signVerifyReducer: (state, { payload }) => {
      const { apiData, isLoading } = payload;
      state.signVerifyDetail = apiData;
      state.signVerifyIsLoading = isLoading;
    },
    resetEmployeeData: (state) => {
      state.searchEmployeeDetail = null;
    },
  },
});

export const { addNewEmployeeReducer, searchEmployeeReducer, updateEmployeeDetailReducer, getAllEmployeeDetailReducer, updateCycleGamesReducer, signVerifyReducer, resetEmployeeData } = adminSlice.actions;

export const adminSelector = (state) => state.admin;
export const adminReducer = adminSlice.reducer;
