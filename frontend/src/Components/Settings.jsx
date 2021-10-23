import React, { useContext, useEffect } from "react";
import "./Settings.css";
import { tabContext } from "../index";

const Settings = () => {
  const { settab } = useContext(tabContext);
  useEffect(() => {
    settab("sett");
  }, [settab]);
  return (
    <div id="settingsparent">
      <div id="settings">
        <div id="currency">
          <label>Set currency: </label>
          <select id="currencies" name="currencies">
            <option value="USD">US Dollars</option>
            <option value="EUR">Euros</option>
            <option value="INR">Indian Rupees</option>
            <option value="AUD">Australian Dollars</option>
            <option value="CNY">Chinese Yuan</option>
          </select>
        </div>
        <hr />
        <div id="excelimport">
          <label>Import data from an Excel file: </label>
          <input id="fileip" type="file" accept=".xlsx" />
        </div>
        <hr />
        <div id="jsonexport">
          <label>Export data as JSON: </label>
          <input type="button" value="Download" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
