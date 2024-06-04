import { Appointment, EventItem } from "./CustomCalendar.types";

export default function RequestAppointment({event,
onClickStudent}: {
  event: EventItem;
  onClickStudent: (val: EventItem) => void;
}) {

  return (
    <button
        type="button" 
        className="btn btn-primary"
        data-toggle="modal" data-target="#studentoverview"
        aria-label={event.data?.appointment?.resource + ` Start Date: ${event.start} End Date: ${event.end}`}
        onClick={() => onClickStudent(event)}
    >
        {event.data?.appointment?.resource}
    </button>
  );
}
