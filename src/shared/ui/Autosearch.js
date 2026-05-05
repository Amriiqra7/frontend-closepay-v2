"use client";

import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export function useAutosearch(apiEndpoint, namespace = "default", additionalQuery = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const debouncedSetSearchTerm = useMemo(() => debounce(setSearchTerm, 400), []);

  const { data, isLoading, error } = useSWR(
    open ? [`autosearch-${namespace}`, searchTerm, JSON.stringify(additionalQuery)] : null,
    () =>
      apiEndpoint({
        name: searchTerm || undefined,
        ...additionalQuery,
      }),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  useEffect(() => () => debouncedSetSearchTerm.cancel(), [debouncedSetSearchTerm]);

  return {
    options: Array.isArray(data?.data) ? data.data : [],
    loading: isLoading,
    error,
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    onInputChange: useCallback(
      (_, value) => {
        debouncedSetSearchTerm(value || "");
      },
      [debouncedSetSearchTerm]
    ),
  };
}

export function Autosearch({
  value,
  options,
  loading,
  open,
  onOpen,
  onClose,
  onChange,
  onInputChange,
  placeholder,
  size = "small",
}) {
  return (
    <Autocomplete
      fullWidth
      size={size}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      options={options || []}
      loading={loading}
      value={value || null}
      onChange={onChange}
      getOptionLabel={(option) => option?.name || ""}
      isOptionEqualToValue={(option, val) => option?._id === val?._id}
      onInputChange={onInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size={size}
          fullWidth
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            "& .MuiInputBase-root": {
              minHeight: 40,
              height: 40,
              paddingRight: "14px !important",
            },
            "& .MuiInputBase-input": {
              padding: "8.5px 0",
            },
          }}
        />
      )}
    />
  );
}

Autosearch.propTypes = {
  value: PropTypes.object,
  options: PropTypes.array,
  loading: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  placeholder: PropTypes.string,
  size: PropTypes.string,
};
