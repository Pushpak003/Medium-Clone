import api from "../utils/api";

export const filterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
}) => {
  let obj;

  if (state != null && !create_new_arr) {
    // Already data hai — next page append karo
    obj = { ...state, results: [...state.results, ...data], page };
  } else {
    // Pehli baar — total count bhi fetch karo
    const { data: { totalDocs } } = await api.post(countRoute, data_to_send);
    obj = { results: data, page: 1, totalDocs };
  }

  return obj;
};