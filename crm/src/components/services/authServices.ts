import { onBasicLogin } from "./queries";
import { MyEndPoints } from "./endpoints";

export const loginStaff = async (data: any) => {
    return new Promise((resolve, reject) => {
        onBasicLogin(MyEndPoints.Authentication.login, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}