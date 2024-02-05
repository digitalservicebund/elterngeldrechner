import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConfigurationState {
  elternGeldDigitalWizardUrl: string | undefined;
}

export const initialStepConfigurationState: ConfigurationState = {
  elternGeldDigitalWizardUrl: "",
};

type ConfigurePayload = ConfigurationState;

const configurationSlice = createSlice({
  name: "configuration",
  initialState: initialStepConfigurationState,
  reducers: {
    configure: (_, action: PayloadAction<ConfigurePayload>) => {
      return action.payload;
    },
  },
});

export const configurationActions = configurationSlice.actions;
export default configurationSlice.reducer;
