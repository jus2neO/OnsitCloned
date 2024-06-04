import { onBasicPostMultiForm, onBasicGet } from "./queries";
import { MyEndPoints } from "./endpoints";

export const addSITGradeFiles = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPostMultiForm(token, MyEndPoints.SIT.sitgradefiles, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getArchieveFilesById = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.SIT.sitgradefiles + "/getbyarchieveid/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}