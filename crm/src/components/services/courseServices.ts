import { onBasicPost, onBasicGet, onBasicPut } from "./queries";
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

export const getYearSectionById = async (token: string, myvar: string, val: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Course.YearSection + "/" + myvar + "/" + val).then((res) => {
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

export const addCourse = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.Course.Course, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const addYearSection = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.Course.YearSection, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateCourse = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Course.Course, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateYearSection = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Course.YearSection, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}