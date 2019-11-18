import React, { useState } from "react";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from 'axios';


const StaticDatePicker = () => {
  const [date, changeDate] = useState(new Date());
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        autoOk
        orientation="landscape"
        variant="static"
        openTo="date"
        value={date}
        onChange={changeDate}
        disablePast
      />
    </MuiPickersUtilsProvider>
  );
};

export default StaticDatePicker;