import { onBasicPost, onBasicGet, onBasicPut } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllRole = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Role.Role).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const addRoleLevel = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.Role.Role, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateRoleLevel = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Role.Role, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}