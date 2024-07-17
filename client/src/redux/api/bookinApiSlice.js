import { apiSlice } from "./apiSlice";
import { BOOKING_URL, CHAPAURL } from "../constants";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: BOOKING_URL,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${BOOKING_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: CHAPAURL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${BOOKING_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: BOOKING_URL,
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${BOOKING_URL}/total-orders`,
    }),

    getTotalSales: builder.query({
      query: () => `${BOOKING_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${BOOKING_URL}/total-sales-by-date`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  // ------------------
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
} = bookingApiSlice;
