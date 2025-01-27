// redux/actions/userActions.js
import { Apiservice } from "../api/apiService";
import { addNewEmployeeReducer, generateQRReducer, getAllEmployeeDetailReducer, searchEmployeeReducer, signVerifyReducer, updateCycleGamesReducer, updateCycleTimeReducer, updateEmployeeDetailReducer, updateMemoryTestReducer } from "../slice/adminSlice";

// let loadingCounter = 0;
// console.log(loadingCounter, "loadingCounter")

// export function apiHelper(apiReducer, method, apiURL, data = "") {
//   return async (dispatch) => {
//     if (loadingCounter === 0) dispatch(setGlobalLoader(true));
//     loadingCounter++;

//     dispatch(apiReducer({ isLoading: true }));
//     Apiservice(method, apiURL, data)
//       .then((e) => {
//         dispatch(apiReducer({ apiData: e?.data, isLoading: false }));
//         loadingCounter--;
//         if (loadingCounter === 0) dispatch(setGlobalLoader(false));
//       })
//       .catch((e) => {
//         dispatch(apiReducer({ isLoading: false }));
//         loadingCounter--;
//         if (loadingCounter === 0) dispatch(setGlobalLoader(false));
//       });
//   };
// } 

export function apiHelper(apiReducer, method, apiURL, data = "", Toastmessage = "", giveToast = true) {
  return async (dispatch) => {
    dispatch(apiReducer({ isLoading: true }));
    Apiservice(method, apiURL, data)
      .then((e) => {
        dispatch(apiReducer({ apiData: e?.data, isLoading: false, }));
      })
      .catch((e) => {
        dispatch(apiReducer({ isLoading: false }));
      });
  };
}

export function getAllEmployeeDetailsApi(payload) {
  return apiHelper(getAllEmployeeDetailReducer, "GET", "/fetch_all_employee_detail", payload);
}

export function AddNewEmployeeApi(payload) {
  return apiHelper(addNewEmployeeReducer, "POST", "/Add_new_employee", payload);
}

export function SearchEmployeApi(payload) {
  return apiHelper(searchEmployeeReducer, "POST", "/overall_employee_details", payload);
}

export function updateEmployeDetailApi(payload) {
  return apiHelper(updateEmployeeDetailReducer, "POST", "/update_employee_details", payload);
}

export function updateCycleGamesApi(payload) {
  return apiHelper(updateCycleGamesReducer, "POST", "/Cycle_games_up_in", payload);
}

export function updateMemoryTestApi(payload) {
  return apiHelper(updateMemoryTestReducer, "POST", "/memory_table_up_in", payload);
}

export function updateCycleTimeAchievementApi(payload) {
  return apiHelper(updateCycleTimeReducer, "POST", "/cycle_time_achievement", payload);
}

export function signVerifyApi(payload) {
  return apiHelper(signVerifyReducer, "POST", "/mouse_sign", payload);
}

export function generateQRApi(payload) {
  return apiHelper(generateQRReducer, "POST", "/QR_generator", payload);
}