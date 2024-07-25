const {
  createSlice,
  nanoid,
  current,
  createAsyncThunk,
} = require("@reduxjs/toolkit");

const initialState = {
  userAPIData: [],
};

export const fetchApiUsers = createAsyncThunk("fetchApiUsers", async () => {
  const result = await fetch("/api/users/me");
  return result.json();
});

const Slice = createSlice({
  name: "user",
  initialState,
  reducers:(builder) => {
      builder.addCase(fetchApiUsers.fulfilled, (state, action) => {
        console.log("reducer", action);

        (state.isloading = false), (state.userAPIData = action.payload);
      });
  },
});

export const { user } = Slice.actions;
export default Slice.reducer;
