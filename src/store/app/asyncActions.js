import { createAsyncThunk} from "@reduxjs/toolkit";
import * as apis from "@/apis";

//https://techmaster.vn/posts/36779/huong-dan-su-dung-createasyncthunk-trong-redux-toolkit
export const getCategories = createAsyncThunk("app/categories", async () => {
    const response = await apis.apiGetCategories();
    if (response.statusCode !== 200) {
        return rejectWithValue(response);
    }
    return response.data.result;
});
