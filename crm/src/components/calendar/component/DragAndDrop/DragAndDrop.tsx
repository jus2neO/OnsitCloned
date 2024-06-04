import moment from "moment";
import { useCallback, useState, useEffect } from "react";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import { EVENTS } from "../CustomCalendar/CustomCalendar.constants";
import { EventItems, Appointment } from "../CustomCalendar/CustomCalendar.types";
import { IAppointment } from "../../../services/type.interface";
import Button from 'react-bootstrap/Button';
import Modal from "../../../common/Modal";
import { mutateAppointments, mutateAppointment } from "../../../services/mutation/appointment";
//import { Box, Flex } from "@chakra-ui/react";
//import OutsideEvent from "../outsideEvent/outsideEvent";
import { getAllAppointmentWithFilesAndStudent } from "../../../services/appointmentServices";
import "./DragAndDrop.scss";

export default function DragAndDrop() {
  const [events, setEvents] = useState<EventItems[]>(EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<EventItems>();
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
    let myEvents: EventItems[] = [];
    events?.forEach((e) => {
      myEvents.push(e);
    });
    if (selectedEvent) myEvents.push(selectedEvent);

    setEvents(myEvents);
    setShowSubmitModal(false);
  }, [selectedEvent]);

  const onChangeEventTime = useCallback(
    (start: Date, end: Date, appointmentId: number | undefined) => {
      let myEvents: EventItems[] = [];
      events?.forEach((e) => {
        if (e.data?.appointment?.id === appointmentId) {
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
      setEvents(newApps);
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const onDoubleClick = (e: any) => {
    setSelectedEvent(e);
    setShowSubmitModal(true);
  }

  const organizeStudent = (student: Appointment, i: number) => {
    let newHourStart = "";
    let newHourEnd = "";
    let startampm = "";
    let endampm = "";

    if(student.start.getHours() > 12){
      const myhrs = (student.start.getHours() - 12).toString();
      const mymin = student.start.getMinutes().toString();
      newHourStart = (myhrs.length > 1 ? myhrs : "0"+myhrs) + ":" + (mymin.length > 1 ? mymin : "0"+mymin);
      startampm = "pm";
    } else {
      const myhrs = student.start.getHours().toString();
      const mymin = student.start.getMinutes().toString();
      newHourStart = (myhrs.length > 1 ? myhrs : "0"+myhrs) + ":" + (mymin.length > 1 ? mymin : "0"+mymin);
      if(student.start.getHours() === 12){
        startampm = "pm";
      } else {
        startampm = "am";
      }
    }

    if(student.end.getHours() > 12){
      const myhrs = (student.end.getHours() - 12).toString();
      const mymin = student.end.getMinutes().toString();
      newHourEnd = (myhrs.length > 1 ? myhrs : "0"+myhrs) + ":" + (mymin.length > 1 ? mymin : "0"+mymin);
      endampm = "pm";
    } else {
      const myhrs = student.end.getHours().toString();
      const mymin = student.end.getMinutes().toString();
      newHourEnd = (myhrs.length > 1 ? myhrs : "0"+myhrs) + ":" + (mymin.length > 1 ? mymin : "0"+mymin);
      if(student.end.getHours() === 12){
        endampm = "pm";
      } else {
        endampm = "am";
      }
    }
    
    return <li key={i}><b>Name:</b> {student.studentName} <b>Time:</b> {newHourStart+startampm} - {newHourEnd+endampm}</li>
  }

  useEffect(() => {
    getAllAppointments();
  }, []);

  return (
    <div className="dnd-calendar-container">
      <Modal
        showSubmitBtn={true}
        isForm={true}
        cancelLabel=''
        submitLabel=''
        isDisplay={showSubmitModal}
        mysize='xl'
        onClickClose={() => setShowSubmitModal(false)}
        title='List of students that has appointment'
      >
        <div className="students-list">
          <ul>
            {selectedEvent && selectedEvent.data?.appointments?.map((app, i) => (
              organizeStudent(app, i)
            ))}
          </ul>
        </div>
      </Modal>
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
          onDoubleClickEvent={onDoubleClick}
          events={events}
        //onDropFromOutside={onDroppedFromOutside}
        />
      </div>
    </div>
  );
}
