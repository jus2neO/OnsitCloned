import { onBasicPost, onBasicGet, onBasicPut } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAppointmentFileByAppId = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Appointment.AppointmentByAppID + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}