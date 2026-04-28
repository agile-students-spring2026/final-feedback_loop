import CreatableSelect from "react-select/creatable";

function TagSelector({ value, onChange, options, isMulti = true }) {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      padding: "2px",
      border: "2px solid black",
      borderRadius: "0",
      color: "#1e141d",
      boxShadow: state.isFocused ? "2px 2px 0 var(--purple)" : "none",
      transform: state.isFocused ? "translate(2px, 2px)" : "translate(0, 0)",
      cursor: "text",
      "&:hover": {
        border: "2px solid black",
        boxShadow: "2px 2px 0 var(--purple)",
      },
    }),

    placeholder: (base) => ({
      ...base,
      color: "#666",
      fontSize: "14px",
    }),

    input: (base) => ({
      ...base,
      color: "#1e141d",
      fontSize: "14px",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: "14px",
    }),

    menu: (base) => ({
      ...base,
      border: "3px solid black",
      boxShadow: "2px 2px 0 black",
      overflow: "hidden",
      borderRadius: "0",
      zIndex: 20,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#1e141d"
        : state.isFocused
          ? "#ddd"
          : "#f5f5f5",
      color: state.isSelected ? "#ffffff" : "#1e141d",
      fontSize: "14px",
      ":active": {
        backgroundColor: "#1e141d",
        color: "#ffffff",
      },
    }),


    dropdownIndicator: (base, state) => ({
      ...base,
      color: "#1e141d",
    }),

    clearIndicator: (base) => ({
      ...base,
      color: "#1e141d"
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: "#1e141d",
      border: "21x solid #1e141d",
      borderRadius: "0",
      boxShadow: "2px 2px 0 black",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "#ffffff"
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "#ffffff",
      borderLeft: "2px solid black",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "#3a335f",
        color: "#ffffff",
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
