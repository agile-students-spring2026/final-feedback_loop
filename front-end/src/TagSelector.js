import CreatableSelect from "react-select/creatable";

function TagSelector({ value, onChange, options, isMulti = true }){
    return(
        <CreatableSelect
            isMulti = {isMulti}
            options = {options}
            value={value}
            onChange={onChange}
            placeholder="Search or create tags..."
        />
    );
}

export default TagSelector;