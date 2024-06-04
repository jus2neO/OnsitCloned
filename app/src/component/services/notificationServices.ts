import { onBasicPost, onBasicGet, onBasicPut } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllNotification = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Notification.notification).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllNotificationByStudentId = async (token: string, studentId: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Notification.notificationByStudentId + "/" + studentId).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const addNotification = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.Notification.notification, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateNotification = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Notification.notification, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateNotificationRead = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Notification.setnotificationByStudentId, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

