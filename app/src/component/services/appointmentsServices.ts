import { onBasicPostMultiForm, onBasicPost, onBasicGet, onBasicPut, onBasicDelete } from "./queries";
import { MyEndPoints } from "./endpoints";

export const addAppointment = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.Appointment.Appointment, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateAppointment = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Appointment.Appointment, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const addAppointmentFiles = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPostMultiForm(token, MyEndPoints.Appointment.AppointmentFile, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getMyAppointmentsByStudentID = async (token: string, studentId: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Appointment.AppointmentWithFilesFindByID + "/" + studentId).then((res) => {
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

export const getActiveAppointmentsByStudentID = async (token: string, studentId: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Appointment.AppointmentActive + "/" + studentId).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const deleteAppointmendFile = async (token: string, fileId: string) => {
    return new Promise((resolve, reject) => {
        onBasicDelete(token, MyEndPoints.Appointment.AppointmentFile + "/" + fileId).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}