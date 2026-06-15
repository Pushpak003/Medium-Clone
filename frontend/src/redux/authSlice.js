import { createSlice } from "@reduxjs/toolkit";

// refreshToken  → localStorage (persist across tabs/reload)
// accessToken   → sirf Redux memory mein (security best practice)
// user info     → localStorage (UI ke liye)

const initialState = {
  accessToken: null,
  refreshToken: localStorage.getItem("medium_refresh_token") || null,
  user: JSON.parse(localStorage.getItem("medium_user")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.user = {
        fullname: payload.fullname,
        username: payload.username,
        profile_img: payload.profile_img,
      };
      // refreshToken persist karo — page reload pe bhi kaam kare
      localStorage.setItem("medium_refresh_token", payload.refreshToken);
      localStorage.setItem("medium_user", JSON.stringify(state.user));
    },

    // Interceptor naya accessToken milne pe yeh call karega
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("medium_refresh_token");
      localStorage.removeItem("medium_user");
    },

    updateProfileImg: (state, { payload }) => {
      state.user.profile_img = payload;
      localStorage.setItem("medium_user", JSON.stringify(state.user));
    },

    updateUsername: (state, { payload }) => {
      state.user.username = payload;
      localStorage.setItem("medium_user", JSON.stringify(state.user));
    },
  },
});

export const { authenticate, setAccessToken, logout, updateProfileImg, updateUsername } =
  authSlice.actions;
export default authSlice.reducer;