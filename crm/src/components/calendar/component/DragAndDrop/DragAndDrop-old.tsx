import moment from "moment";
import { useCallback, useState, useEffect } from "react";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import { EVENTS } from "../CustomCalendar/CustomCalendar.constants";
import { EventItem, EventItems, Appointment } from "../CustomCalendar/CustomCalendar.types";
import { IAppointment } from "../../../services/type.interface";
import { mutateAppointments, mutateAppointment } from "../../../services/mutation/appointment";
//import { Box, Flex } from "@chakra-ui/react";
//import OutsideEvent from "../outsideEvent/outsideEvent";
import { getAllAppointmentWithFilesAndStudent } from "../../../services/appointmentServices";
import "./DragAndDrop.scss";

export default function DragAndDrop() {
  const [events, setEvents] = useState<EventItem[]>();
  const [myevents, setMyEvents] = useState<EventItems[]>();
  const [selectedEvent, setSelectedEvent] = useState<EventItem>();
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const token = "";
  /*const [draggedEvent, setDraggedEvent] = useState<
    Appointment | "undroppable"
  >();*/

  const dummyAppointment = {
    start: moment("2024-02-09T13:00:00").toDate(),
    end: moment("2024-02-09T14:00:00").toDate(),
    data: {
      appointment: {
        id: 3,
        status: "CI",
        location: "Connecticut",
        resource: "Alex Hales",
        address: "1241 E Main St\n Stamford\n CT 06902\n United States",
      },
    },
    isDraggable: true,
    isRizeable: true
  };

  /*const onDroppedFromOutside = useCallback((props: any) => {
      if (draggedEvent === "undroppable") return;
      let myEvents: EventItem[] = [];
      events.forEach((e) => {
          myEvents.push(e);
      });
      if(draggedEvent){
        myEvents.push({
          start: props.start,
          end: props.end,
          data: { appointment: draggedEvent },
          isDraggable: true,
          isRizeable: true
        });
      }
      setEvents(myEvents);

    },
    [draggedEvent, events]
  );*/

  const onClickSubmitStudent = useCallback(() => {
    let myEvents: EventItem[] = [];
      events?.forEach((e) => {
          myEvents.push(e);
      });
      if(selectedEvent) myEvents.push(selectedEvent);

      setEvents(myEvents);
      setShowSubmitModal(false);
  }, [selectedEvent]);

  const onClickStudent = (val: EventItem) => {
    setSelectedEvent(val);
    setShowSubmitModal(true);
  }

  const onChangeEventTime = useCallback(
    (start: Date, end: Date, appointmentId: number | undefined) => {
      let myEvents: EventItem[] = [];
      events?.forEach((e) => {
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

  const getAllAppointments = async () => {
    await getAllAppointmentWithFilesAndStudent(token).then((res: any) => {
      const newApp = mutateAppointment(res);
      const newApps = mutateAppointments(res);
      setEvents(newApp);
      setMyEvents(newApps);
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  useEffect(() => {
    getAllAppointments();
  }, []);

  return (
    <div className="dnd-calendar-container">
      <div className="calendar-container">
        <CustomCalendar
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
  );
}
