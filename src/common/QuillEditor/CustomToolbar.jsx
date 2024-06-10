import React from "react";
import formats from "./ToolbarOptions.ts";

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const renderOptions = (formatData) => {
  const { className, options } = formatData;
  return (
    <select className={className}>
      <option selected="selected"></option>
      {options.map((value) => {
        return <option value={value}></option>;
      })}
    </select>
  );
};
const renderSingle = (formatData) => {
  const { className, value } = formatData;
  return <button className={className} value={value}></button>;
};
const CustomToolbar = ({ id = "toolbar" }) => (
  <div id={id}>
    {formats.map((classes) => {
      return (
        <span className="ql-formats">
          {classes.map((formatData) => {
            return formatData.options
              ? renderOptions(formatData)
              : renderSingle(formatData);
          })}
        </span>
      );
    })}
  </div>
);
export default CustomToolbar;
