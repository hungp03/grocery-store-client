import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import * as apis from "@/apis";

export const getCurrentUser = createAsyncThunk("user/current", async () => {
  const response = await apis.apiGetCurrentUser()
  if (response.statusCode !== 200) {
    return isRejectedWithValue(response);
  } 
  return response.data;
});
