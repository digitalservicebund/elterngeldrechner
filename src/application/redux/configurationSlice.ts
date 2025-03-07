import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ConfigurationState {
  elternGeldDigitalWizardUrl: string | undefined;
}

export const configurationSlice = createSlice({
  name: "configuration",
  initialState: { elternGeldDigitalWizardUrl: "" } as ConfigurationState,
  reducers: {
    configure: (_, { payload }: PayloadAction<ConfigurationState>) => payload,
  },
});
