import React from "react";
function Input(props) {
  return (
    <>
      <input
        className={`activity-input ${props.className}`}
        type={props.type}
        value={props.value}
        onFocus={(e) => (e.currentTarget.placeholder = "")}
        onBlur={(e) => (e.currentTarget.placeholder = props.placeholder)}
        placeholder={props.placeholder}
      />
    </>
  );
}

export default Input;
