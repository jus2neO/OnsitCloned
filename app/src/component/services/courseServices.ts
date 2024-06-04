import { onBasicGet } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllCourse = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Course.Course).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllYearSection = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Course.YearSection).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getCourseById = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Course.Course + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getYearSectionById = async (token: string, myvar: string, val: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Course.YearSection + "/" + myvar + "/" + val).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getYearSectionByCourseID = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Course.YearSection + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}
