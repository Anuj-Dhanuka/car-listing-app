import { configureStore } from "@reduxjs/toolkit";

//Reducers
import carsReducer from "../slices/carsSlice"
import authReducer from "../slices/authSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
  },
});

export default store;
