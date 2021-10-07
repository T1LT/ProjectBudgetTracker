import React from "react";
import "./Settings.css";

const Settings = () => {
  return (
    <>
      <div id="currency">
        <label>Set currency: </label>
        <br />
        <br />
        <select id="currencies" name="currencies">
          <option value="USD">US Dollars</option>
          <option value="EUR">Euros</option>
          <option value="INR">Indian Rupees</option>
          <option value="AUD">Australian Dollars</option>
          <option value="CNY">Chinese Yuan</option>
        </select>
      </div>
      <br />
      <hr />
      <br />
      <div id="excelimport">
        <label>Import data from an Excel file: </label>
        <br />
        <br />
        <input type="file" accept=".xlsx" />
      </div>
      <br />
      <hr />
      <br />
      <div id="jsonexport">
        <label>Export data as JSON: </label>
        <br />
        <br />
        <input type="button" value="Download" />
      </div>
    </>
  );
};

export default Settings;
