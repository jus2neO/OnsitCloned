import { onBasicGet } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllSIT = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.SIT.SIT).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllSITRequirements = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.SIT.SITRequirement).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}