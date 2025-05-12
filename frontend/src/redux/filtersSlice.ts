// src/redux/filtersSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';  // type-only import

interface ServiceFilter {
  name: string;
  priceMin: number;
  priceMax: number;
}

interface ApplicationFilter {
  status: string;
  start_date: string | null;
  end_date: string | null;
}

interface FiltersState {
  serviceFilter: ServiceFilter;
  applicationFilter: ApplicationFilter;
}

const initialState: FiltersState = {
  serviceFilter: {
    name: '',
    priceMin: 0,
    priceMax: 1000,
  },
  applicationFilter: {
    start_date: null,
    end_date: null,
    status: '',
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setServiceFilter: (state, action: PayloadAction<ServiceFilter>) => {
      state.serviceFilter = action.payload;
    },
    setApplicationFilter: (state, action: PayloadAction<ApplicationFilter>) => {
      state.applicationFilter = action.payload;
    },
  },
});

export const { setServiceFilter, setApplicationFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
