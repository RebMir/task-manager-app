import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URI = "hhttps://task-manager-app-mvmv.onrender.com/api";

const baseQuery = fetchBaseQuery({ baseUrl: API_URI});


export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "/api/task",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ["Users", "Tasks"],
    endpoints: () => ({}),
});
