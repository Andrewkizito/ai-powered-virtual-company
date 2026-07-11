import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer, type Storage } from "redux-persist"
import authReducer from "./auth/slice"

const localStorage: Storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) =>
    Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
}

const rootReducer = combineReducers({
  auth: authReducer,
})

const persistConfig = {
  key: "root",
  storage: localStorage,
  whitelist: ["auth"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
