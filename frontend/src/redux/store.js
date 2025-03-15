import { configureStore } from "@reduxjs/toolkit";
import personaReducer from "./personaSlice";

export default configureStore({
  reducer: {
    personas: personaReducer,
  },
});
