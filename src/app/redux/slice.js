import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  userAPIData: null,
  isLoading: true,
  error: null,
};

export const fetchApiUsers = createAsyncThunk(
  "user/fetchApiUsers",
  async () => {
    const response = await fetch("/api/users/me");
    console.log(response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApiUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAPIData = action.payload.dataUser;
      })
      .addCase(fetchApiUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
