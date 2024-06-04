import { onBasicPut, onBasicGet, onBasicPostFile, onBasicPost } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllStaff = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Staff.Staff).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getStaffById = async (token: string, id: number) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Staff.Staff + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const onUploadStaffExcel = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPostFile(token, MyEndPoints.Staff.ExcelStaff, data).then((res: any) => {
            return resolve(res.data);
        }).catch((err) => {
            throw reject(err);
        });
    });
}

export const onUpdateStaff = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Staff.Staff, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const changeStaffPassword = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Staff.Staff + "/" + id + "/changepassword").then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}