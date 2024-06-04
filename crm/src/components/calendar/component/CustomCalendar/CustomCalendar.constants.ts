import moment from "moment";
import { EventItem } from "./CustomCalendar.types";

export enum AppointmentStatusCode {
  Pending = "P",
  CheckedIn = "CI",
}

export const EVENT_STATUS_COLORS = {
  P: "#bee2fa",
  CI: "#c7edca",
};

export const EVENTS: EventItem[] = [
  {
    start: moment("2024-02-09T10:00:00").toDate(),
    end: moment("2024-02-09T11:00:00").toDate(),
    data: {
      appointment: {
        id: 1,
        status: "P",
        contact: "0911123354",
        studentName: "Dr Alex",
        email: "dr.alex@gmail.com",
        start: new Date("2024-02-09T10:00:00"),
        end: new Date("2024-02-09T10:00:00"),
      },
    },
    isDraggable: true,
    isRizeable: true
  },
  {
    start: moment("2024-02-09T12:00:00").toDate(),
    end: moment("2024-02-09T13:00:00").toDate(),
    data: {
      appointment: {
        id: 2,
        status: "CI",
        contact: "091245894",
        studentName: "Dr David",
        email: "dr.david@gmail.com",
        start: new Date("2024-02-09T10:00:00"),
        end: new Date("2024-02-09T10:00:00"),
      },
    },
    isDraggable: true,
    isRizeable: true
  },
  {
    start: moment("2024-02-10T00:00:00").toDate(),
    end: moment("2024-02-10T23:59:59").toDate(),
    data: {
      blockout: {
        id: 1,
        name: "Christmas Holidays",
      },
    },
    isDraggable: false,
    isRizeable: false
  },
];
