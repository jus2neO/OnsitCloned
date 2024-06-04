import { IAppointment } from "../type.interface";
import { EventItem, EventItems } from "../../calendar/component/CustomCalendar/CustomCalendar.types";
import moment from "moment";

export const mutateAppointments = (data: IAppointment[]) => {
    //moment("2024-02-10T00:00:00").toDate(),
    let newAppointment: any;
    let newEventItems: EventItems[] = [];
    data.forEach((d, i) => {
        if (d.status === "approve") {
            let newStat = "";
            const myStartDate = new Date(d.start);
            const myEndDate = new Date(d.end);
            const mykey = myStartDate.getMonth().toString() + "-" + myStartDate.getDate().toString() + "-" + myStartDate.getFullYear().toString();
            //if(d.status === "pending") newStat = "P";
            if (d.status === "approve") newStat = "CI";
            if (newAppointment) {
                if (newAppointment[mykey]) {
                    newAppointment[mykey] = {
                        ...newAppointment[mykey],
                        data: {
                            appointment: {
                                id: i,
                                contact: "",
                                email: "",
                                status: newStat,
                                studentName: "Appointments"
                            },
                            appointments: [
                                ...newAppointment[mykey].data.appointments
                                , {
                                    id: d.id,
                                    contact: d.student?.contact,
                                    email: d.student?.email,
                                    status: newStat,
                                    studentName: d.student?.lname + ", " + d.student?.fname + " " + d.student?.mname,
                                    start: new Date(d.start),
                                    end: new Date(d.end),
                                }]
                        }
                    }
                } else {
                    newAppointment = {
                        ...newAppointment,
                        [mykey]: {
                            end: new Date((myEndDate.getMonth() + 1).toString() + "-" + myEndDate.getDate().toString() + "-" + myEndDate.getFullYear().toString() + " " + "16" + ":" + "00" + ":" + "00"),
                            start: new Date((myStartDate.getMonth() + 1).toString() + "-" + myStartDate.getDate().toString() + "-" + myStartDate.getFullYear().toString() + " " + "08" + ":" + "00" + ":" + "00"),
                            isDraggable: true,
                            isRizeable: true,
                            data: {
                                appointment: {
                                    id: i,
                                    contact: "",
                                    email: "",
                                    status: newStat,
                                    studentName: "Appointments"
                                },
                                appointments: [{
                                    id: d.id,
                                    contact: d.student?.contact,
                                    email: d.student?.email,
                                    status: newStat,
                                    studentName: d.student?.lname + ", " + d.student?.fname + " " + d.student?.mname,
                                    start: new Date(d.start),
                                    end: new Date(d.end),
                                }]
                            }
                        }
                    }
                }
            } else {
                newAppointment = {
                    ...newAppointment,
                    [mykey]: {
                        end: new Date((myEndDate.getMonth() + 1).toString() + "-" + myEndDate.getDate().toString() + "-" + myEndDate.getFullYear().toString() + " " + "16" + ":" + "00" + ":" + "00"),
                        start: new Date((myStartDate.getMonth() + 1).toString() + "-" + myStartDate.getDate().toString() + "-" + myStartDate.getFullYear().toString() + " " + "08" + ":" + "00" + ":" + "00"),
                        isDraggable: true,
                        isRizeable: true,
                        data: {
                            appointment: {
                                id: i,
                                contact: "",
                                email: "",
                                status: newStat,
                                studentName: "Appointments"
                            },
                            appointments: [{
                                id: d.id,
                                contact: d.student?.contact,
                                email: d.student?.email,
                                status: newStat,
                                studentName: d.student?.lname + ", " + d.student?.fname + " " + d.student?.mname,
                                start: new Date(d.start),
                                end: new Date(d.end),
                            }]
                        }
                    }
                }
            }

        }
    });

    for (const [key, value] of Object.entries(newAppointment)) {
        const newValue: any = value;
        newEventItems.push(newValue);
    }

    return newEventItems;
}

export const mutateAppointment = (data: IAppointment[]) => {
    let newEventItems: EventItem[] = [];
    //moment("2024-02-10T00:00:00").toDate(),
    data.forEach((d) => {
        if (d.status === "approve") {
            let newStat = "";
            //if(d.status === "pending") newStat = "P";
            if (d.status === "approve") newStat = "CI";
            newEventItems.push({
                end: new Date(d.end),
                start: new Date(d.start),
                isDraggable: true,
                isRizeable: true,
                data: {
                    appointment: {
                        id: d.id,
                        contact: d.student?.contact,
                        email: d.student?.email,
                        status: newStat,
                        studentName: d.student?.lname + ", " + d.student?.fname + " " + d.student?.mname,
                        start: new Date(d.start),
                        end: new Date(d.end),
                    }
                }
            });
        }
    });

    return newEventItems;
}