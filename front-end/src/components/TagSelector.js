import CreatableSelect from "react-select/creatable";

function TagSelector({ value, onChange, options, isMulti = true }) {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#14112E" : "rgb(204, 204, 204)",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(130, 123, 255, 0.329)" : "none",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#14112E"
        : state.isFocused
          ? "#d2d0f7"
          : "white",
      color: state.isSelected ? "white" : "#333",
      ":active": {
        backgroundColor: "#14112E",
      },
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#ffffff",
      backgroundColor: "#14112ebe",
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "#ffffff",
      backgroundColor: "#14112ebe",
      ":hover": {
        backgroundColor: "#3d348b8f"
      },
    }),
  };

  return (
    <CreatableSelect
      isMulti={isMulti}
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Search or create tags..."
      styles={customStyles}
    />
  );
}

export default TagSelector;
