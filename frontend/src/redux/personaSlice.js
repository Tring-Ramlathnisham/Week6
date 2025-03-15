import { createSlice } from "@reduxjs/toolkit";

// Load personas from localStorage
const loadPersonas = () => {
  const data = localStorage.getItem("personas");
  return data ? JSON.parse(data) : [];
};

// Save personas to localStorage
const savePersonas = (personas) => {
  localStorage.setItem("personas", JSON.stringify(personas));
};

const personaSlice = createSlice({
  name: "personas",
  initialState: { personas: loadPersonas() },
  reducers: {
    addPersona: (state, action) => {
      state.personas.push(action.payload);
      savePersonas(state.personas);
    },
    updatePersona: (state, action) => {
      state.personas = state.personas.map((p) =>
        p.id === action.payload.id ? action.payload : p
      );
      savePersonas(state.personas);
    },
    deletePersona: (state, action) => {
      state.personas = state.personas.filter((p) => p.id !== action.payload);
      savePersonas(state.personas);
    },
  },
});

export const { addPersona, updatePersona, deletePersona } = personaSlice.actions;
export default personaSlice.reducer;
