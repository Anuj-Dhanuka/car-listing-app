import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cars: [],
};

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    addCar: (state, action) => {
      state.cars.push(action.payload);
    },
    updateCar: (state, action) => {
      const { id, updatedCar } = action.payload;
      const carIndex = state.cars.findIndex((car) => car.id === id);
      if (carIndex !== -1) {
        state.cars[carIndex] = updatedCar;
      }
    },
    deleteCar: (state, action) => {
      const id = action.payload;
      state.cars = state.cars.filter((car) => car.id !== id);
    },
    setCars: (state, action) => {
      state.cars = action.payload;
    },
  },
});

export const { addCar, updateCar, deleteCar, setCars } = carsSlice.actions;

export default carsSlice.reducer;
