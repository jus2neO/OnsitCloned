import { onBasicPost, onBasicGet, onBasicPut, onBasicDelete } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllCompany = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Company.Company).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllCompanyPref = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.CompanyPreferredCourse.CompanyPref).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getNumberOfStudentsFromCompany = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.Company.StudentsNumber, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllCompanyPrefCourse = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.CompanyPreferredCourse.CompanyPref).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const addCompany = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.Company.Company, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const addCompanyCourseRef = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.CompanyPreferredCourse.CompanyPref, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateCompany = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Company.Company, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const removeCompanyFromStudents = async (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Company.RemoveCompanyFromStudent, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const deleteCompanyPrefByVar = async (token: string, myvar: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicDelete(token, MyEndPoints.CompanyPreferredCourse.CompanyPrefDelVar + "/" + myvar + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const deleteCompanyPrefById = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicDelete(token, MyEndPoints.CompanyPreferredCourse.CompanyPref + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}