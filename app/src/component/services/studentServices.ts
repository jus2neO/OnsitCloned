import { onBasicPut, onBasicGet } from "./queries";
import { MyEndPoints } from "./endpoints";

export const changePassword = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Students.Students, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getStudentByID = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Students.Students + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getStudentPhotoByID = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Students.StudentPhoto + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllStudentSITCompanyArchieve = (token: string, studentId: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Students.Archieve + "/studentid/" + studentId).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateProfile = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Students.Students, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateStudentPhoto = (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Students.StudentUploadPhoto, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}