import { onRequest, onRequestFile, onRequestMultiForm, onRequestAuth } from "../helpers/requests";

export const onBasicLogin = async (path: string, data: any) => {
    return new Promise((resolve, reject) => {
        onRequestAuth()
            .post(path, data)
            .then((res) => {
                return resolve(res.data);
            }
            ).catch((err) => { return reject(err) });
    });
}

export const onBasicGet = async (token: string, path: string) => {
    return new Promise((resolve, reject) => {
        onRequest(token)
            .get(path)
            .then((res) => {
                return resolve(res.data);
            }
            ).catch((err) => {
                return reject(err)
            });
    });
}

export const onBasicPost = async (token: string, path: string, data: any) => {
    return new Promise((resolve, reject) => {
        onRequest(token)
            .post(path, data)
            .then((res) => {
                return resolve(res.data);
            }
            ).catch((err) => { return reject(err) });
    });
}

export const onBasicPostFile = async (token: string, path: string, data: any) => {
    return new Promise((resolve, reject) => {
        onRequestFile(token)
            .post(path, data)
            .then((res) => {
                return resolve(res.data);
            }
            ).catch((err) => { return reject(err) });
    });
}

export const onBasicPut = async (token: string, path: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onRequest(token)
            .put(path + "/" + id, data)
            .then((res) => {
                return resolve(res.data);
            }
            ).catch((err) => { return reject(err) });
    });
}

export const onBasicDelete = async (token: string, path: string) => {
    return new Promise((resolve, reject) => {
        onRequest(token)
            .delete(path)
            .then((res) => {
                return resolve(res.data);
            }
            ).catch((err) => { return reject(err) });
    });
}

export const onBasicPostMultiForm = async (token: string, path: string, data: any) => {
    return new Promise((resolve, reject) => {
        onRequestMultiForm(token)
            .post(path, data)
            .then((res) => {
                return resolve(res.data);
            }
            ).catch((err) => { return reject(err) });
    });
}