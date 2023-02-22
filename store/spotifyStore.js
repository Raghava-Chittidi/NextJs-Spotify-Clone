import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const playlistIdSlice = createSlice({
  name: "playlistId",
  initialState: { id: "37i9dQZF1EXoCwlP4TrVZE" },
  reducers: {
    select(state, action) {
      state.id = action.payload.id;
    },
  },
});

const playlistSlice = createSlice({
  name: "playlist",
  initialState: { playlist: null },
  reducers: {
    select(state, action) {
      state.playlist = action.payload.playlist;
    },
  },
});

const currentTrackSlice = createSlice({
  name: "track",
  initialState: { track: null },
  reducers: {
    select(state, action) {
      state.track = action.payload.track;
    },
  },
});

const isPlayingSlice = createSlice({
  name: "isPlaying",
  initialState: { isPlaying: false },
  reducers: {
    set(state, action) {
      state.isPlaying = action.payload.isPlaying;
    },
  },
});

export const playlistIdActions = playlistIdSlice.actions;
export const playlistActions = playlistSlice.actions;
export const trackActions = currentTrackSlice.actions;
export const isPlayingActions = isPlayingSlice.actions;

const store = configureStore({
  reducer: {
    playlistId: playlistIdSlice.reducer,
    playlist: playlistSlice.reducer,
    track: currentTrackSlice.reducer,
    isPlaying: isPlayingSlice.reducer,
  },
});

export default store;
