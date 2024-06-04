import { onBasicPost, onBasicGet, onBasicPut } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllDTR = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.DTR.dtr).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllDTRByDate = async (token: string, myvar: string, date: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.DTR.dtrByDate+"/"+myvar+"/"+date).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const addDTR = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.DTR.dtr, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateDTR = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.DTR.dtr, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}