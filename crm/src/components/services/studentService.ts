import { onBasicPut, onBasicGet, onBasicPostFile, onBasicPost, onBasicDelete } from "./queries";
import { MyEndPoints } from "./endpoints";

export const getAllStudents = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Students.Students).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllStudentsWithCourseYearSection = async (token: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Students.StudentsWithCourseYearSection).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getStudentById = (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Students.Students + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const getAllStudentSITCompanyArchieve = (token: string, studentId: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Students.Archieve + "/studentid/" + studentId).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
} 

export const addStudentSITCompanyArchieve = (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPost(token, MyEndPoints.Students.Archieve, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
} 

export const updateStudentSITCompanyArchieve = (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Students.Archieve, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
} 

export const updateStudent = (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Students.Students, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const onUploadStudentExcel = async (token: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPostFile(token, MyEndPoints.Students.ExcelStudents, data).then((res: any) => {
            return resolve(res.data);
        }).catch((err) => {
            throw reject(err);
        });
    });
}

export const changeStudentPassword = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicGet(token, MyEndPoints.Students.Students + "/" + id + "/changepassword").then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const updateStudentPhoto = (token: string, id: string, data: any) => {
    return new Promise((resolve, reject) => {
        onBasicPut(token, MyEndPoints.Students.StudentUploadPhoto, id, data).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}

export const deleteStudent = async (token: string, id: string) => {
    return new Promise((resolve, reject) => {
        onBasicDelete(token, MyEndPoints.Students.Students + "/" + id).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
        });
    });
}