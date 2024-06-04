import {
  Calendar as BigCalendar,
  CalendarProps,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "./index.css";
//import YearView from "./YearView/YearView";
//import { EVENTS } from "./CustomCalendar/CustomCalendar.constants";

const localizer = momentLocalizer(moment);

export const Calendar = (props: Omit<CalendarProps, "localizer">) => {
  return (
    <BigCalendar
      {...props}
      selectable
      localizer={localizer}
      defaultDate={moment(new Date().toString()).toDate()}
      defaultView={"month"}
      //max={moment("2022-10-10T16:00:00").toDate()}
      //min={moment("2022-10-10T08:00:00").toDate()}
      views={{
        month: true,
        day: false,
        week: false,
        //year: YearView
      } as any}
      messages={{ year: "Year" } as any}
    />
  );
};
