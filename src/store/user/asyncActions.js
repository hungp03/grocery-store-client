import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import * as apis from "@/apis";

export const getCurrentUser = createAsyncThunk("user/current", async () => {
  const response = await apis.apiGetCurrentUser()
  if (response.statusCode !== 200) {
    return isRejectedWithValue(response);
  }

  // format temporary
  if (response.data && response.data.user && response.data.cartLength) { 
    response.data.user.cartLength = response.data.cartLength;
    delete response.data.cartLength;
  }

  return response.data.user;
});
