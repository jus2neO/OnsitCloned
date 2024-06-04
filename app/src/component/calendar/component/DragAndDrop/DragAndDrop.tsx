import { useCallback, useState } from "react";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import { EVENTS } from "../CustomCalendar/CustomCalendar.constants";
import { EventItem } from "../CustomCalendar/CustomCalendar.types";
import {  } from "../../../services/sitServices";
import "./DragAndDrop.scss";

export default function DragAndDrop() {
  const [events, setEvents] = useState(EVENTS);

  const onChangeEventTime = useCallback(
    (start: Date, end: Date, appointmentId: number | undefined) => {
      let myEvents: EventItem[] = [];
      events.forEach((e) => {
        if(e.data?.appointment?.id === appointmentId){
          e.start = start;
          e.end = end;
          myEvents.push(e);
        } else {
          myEvents.push(e);
        }
      });

      setEvents(myEvents);
    },
    [events]
  );

  const onSelectData = (event: any) => {
    /*
    setErrorMessage("");
    setSuccessMessage("");
    setmyTime(event.start);
    setFormData({
      ...formData,
      start: event.start
    })
    setShowAppointmentModal(true);*/
  }

  return (
    <div className="dnd-calendar-container">
      <div className="row">
        <div className="col-auto col-md-12 min-vh-100 d-flex justify-content-between flex-column">
          <div className="calendar-container">
            <CustomCalendar
              onSelectSlot={onSelectData}
              resizableAccessor={(event: any) => {
                return event?.isRizeable;
              }}
              draggableAccessor={(event: any) => {
                return event?.isDraggable;
              }}
              onEventDrop={({ start, end, event }: any) => {
                onChangeEventTime(start, end, event?.data?.appointment?.id);
              }}
              onEventResize={({ start, end, event }: any) => {
                onChangeEventTime(start, end, event?.data?.appointment?.id);
              }}
              events={events}
              //onDropFromOutside={onDroppedFromOutside}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
