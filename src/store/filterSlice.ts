import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    category: string | null;
    priceRange: [number, number] | null;
    brand: string | null;
    search: string | null;
}

const initialState: FilterState = {
    category: null,
    priceRange: null,
    brand: null,
    search: null,
};

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setCategory(state, action: PayloadAction<string | null>) {
            state.category = action.payload;
        },
        setPriceRange(state, action: PayloadAction<[number, number] | null>) {
            state.priceRange = action.payload;
        },
        setBrand(state, action: PayloadAction<string | null>) {
            state.brand = action.payload;
        },
        setSearch(state, action: PayloadAction<string | null>) {
            state.search = action.payload;
        },
    },
});

export const { setCategory, setPriceRange, setBrand, setSearch } = filterSlice.actions;
export default filterSlice.reducer;