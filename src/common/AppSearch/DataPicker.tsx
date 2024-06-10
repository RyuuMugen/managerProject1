import { EuiDatePicker, EuiDatePickerRange } from "@elastic/eui";
import moment from "moment";
import { useState } from "react";

const DatePicker = ({
  onChangeTimeRange,
  startTime,
  endTime,
}: DatePickerProps) => {
  const minDate = moment().subtract(2, "y");
  const maxDate = moment();
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState(maxDate);

  const isInvalid =
    startDate > endDate || startDate < minDate || endDate > maxDate;

  const handlerChangeDate = () => {
    if (onChangeTimeRange) {
      onChangeTimeRange(startDate, endDate);
    }
  };

  return (
    <EuiDatePickerRange
      isInvalid={isInvalid}
      startDateControl={
        <EuiDatePicker
          selected={startDate}
          onChange={(date) => date && (setStartDate(date), handlerChangeDate())}
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={endDate}
          aria-label="Start date"
          showTimeSelect
        />
      }
      endDateControl={
        <EuiDatePicker
          selected={endDate}
          onChange={(date) => date && (setEndDate(date), handlerChangeDate())}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={maxDate}
          aria-label="End date"
          showTimeSelect
        />
      }
    />
  );
};

export default DatePicker;

type DatePickerProps = {
  onChangeTimeRange?: (
    startTime: moment.Moment,
    endTime: moment.Moment
  ) => void;
  startTime?: string;
  endTime?: string;
};
