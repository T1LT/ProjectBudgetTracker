import React from "react";

const MonthInput = ({
  month,
  index,
  formProjectData,
  setFormProjectData,
  currentMonth,
  showInputError,
  setShowInputError,
}) => {
  //   index =
  //     +formProjectData["projectStartDate"].split("-")[1] - currentMonth + index <
  //     0
  //       ? +formProjectData["projectStartDate"].split("-")[1] -
  //         currentMonth +
  //         index +
  //         12
  //       : +formProjectData["projectStartDate"].split("-")[1] -
  //           currentMonth +
  //           index >=
  //         12
  //       ? +formProjectData["projectStartDate"].split("-")[1] -
  //         currentMonth +
  //         index -
  //         12
  //       : +formProjectData["projectStartDate"].split("-")[1] -
  //         currentMonth +
  //         index;

  return (
    <>
      <label
        className={showInputError[index] ? "labelError2" : "month-class"}
        htmlFor={month}
      >
        {month}
      </label>
      <input
        className={showInputError[index] ? "errorClass2" : "month-class"}
        name="month-input"
        type="text"
        defaultValue={
          formProjectData["projectMonthlyBudgets"][index]
            ? Math.abs(formProjectData["projectMonthlyBudgets"][index])
            : 0
        }
        min="0"
        onChange={(event) => {
          if (
            event.target.validity.badInput ||
            !/^[0-9]*$/.test(event.target.value)
          ) {
            let temp = showInputError;
            temp[index] = true;
            setShowInputError(temp);
          } else {
            let temp = showInputError;
            temp[index] = false;
            setShowInputError(temp);
          }
          let temp = [...formProjectData["projectMonthlyBudgets"]];
          temp[index] = parseInt(event.target.value ? event.target.value : 0);
          setFormProjectData(() => ({
            ...formProjectData,
            projectMonthlyBudgets: temp,
          }));
        }}
      />
    </>
  );
};

export default MonthInput;
