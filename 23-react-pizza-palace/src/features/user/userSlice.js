import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk("user/fetchAddress", async () => {
  // 1) We get the user's geolocation position
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  // 3) Then we return an object with the data that we are interested in
  return { position, address };
});

const initialState = {
  name: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateUsername(state, action) {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAddress.pending, (state) => {
      state.error = "";
      state.status = "loading";
    });
    builder.addCase(fetchAddress.fulfilled, (state, action) => {
      const { position, address } = action.payload;
      state.position = position;
      state.address = address;
      state.status = "idle";
    });
    builder.addCase(fetchAddress.rejected, (state) => {
      state.error =
        "There was a problem getting your address. Make sure to fill this field!";
      state.status = "error";
    });
  },
});

export const { updateUsername } = userSlice.actions;

export const getUsername = (state) => state.user.name;

export default userSlice.reducer;
