import moment from "moment";
import { Calendar } from "../Calendar";
import Appointment from "./AppointmentEvent";
import Blockout from "./BlockoutEvent";
import { EVENTS } from "./CustomCalendar.constants";

import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { CalendarProps, Views, momentLocalizer } from "react-big-calendar";
import { EventItem } from "./CustomCalendar.types";
import AppointmentEvent from "./AppointmentEvent";
import BlockoutEvent from "./BlockoutEvent";

const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(Calendar);
type DnDType = CalendarProps & withDragAndDropProps;
type CustomCalendarProps = Omit<DnDType, "components" | "localizer">;

export default function CustomCalendar(props: CustomCalendarProps) {
  const components = {
    event: ({ event }: any) => {
      const data = event?.data;
      if (data?.appointment)
        return <AppointmentEvent appointment={data?.appointment} />;
      if (data?.blockout) return <BlockoutEvent blockout={data?.blockout} />;

      return null;
    },
  };

  const { appointments, blockouts } = EVENTS.reduce(
    (acc, event) => {
      if (event?.data?.appointment) acc.appointments.push(event);
      if (event?.data?.blockout) acc.blockouts.push(event);
      return acc;
    },
    { appointments: [] as EventItem[], blockouts: [] as EventItem[] }
  );

  return (
    <DnDCalendar
      components={components}
      localizer={localizer}
      events={appointments}
      backgroundEvents={blockouts}
      step={15}
      timeslots={4}
      {...props}
    />
  );
}
