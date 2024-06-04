import { onBasicPost, onBasicGet, onBasicPut } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllAppointment = async (token: string) => {

    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Appointment.Appointment).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllAppointmentWithFilesAndStudent = async (token: string) => {

    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Appointment.AppointmentsWithFilesAndStudent).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateAppointmentStatus = async (token: string, id: string, data: any) => {

    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Appointment.AppointmentStatus, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getMyAppointmentsByDate = async (token: string, date: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Appointment.Getallappointmentbydate + "/start/" + date).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}