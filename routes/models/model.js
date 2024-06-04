const db = require('../../db/db_connection.js');

module.exports = class Model {

    constructor(table) {
        this.table = table;
    }

    //get all table rows and return the result object:
    get_all() {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT * FROM ??', [cThis.table], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }

    }

    //get row by id and return the result object:
    find(id) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT * FROM ?? WHERE id = ?', [cThis.table, id], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result[0]);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findByEmail(email) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT * FROM ?? WHERE email = ?', [cThis.table, email], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result[0]);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findByStudentID(id) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT * FROM ?? WHERE studentid = ?', [cThis.table, id], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findStudentById(id) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT id,fname,lname,mname,studentphoto,SIT,email,contact,address,isInit,status,civilstatus,birthdate,age,sex,height,weight,collegedepartment,companyid,CompanyStatus,course,yearsection,fathersname,fathersaddress,fatherscontact,mothersname,mothersaddress,motherscontact,companystatusdate,created,modified FROM ?? WHERE id = ?', [cThis.table, id], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result[0]);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findStudentPhotoById(id) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT studentphoto FROM ?? WHERE id = ?', [cThis.table, id], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result[0]);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findAllStudent() {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT id,fname,lname,mname,studentphoto,SIT,email,contact,address,isInit,status,civilstatus,birthdate,age,sex,height,weight,collegedepartment,companyid,CompanyStatus,course,yearsection,fathersname,fathersaddress,fatherscontact,mothersname,mothersaddress,motherscontact,companystatusdate,created,modified FROM ??', [cThis.table], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get all staff and return the result object:
    findAllStaff() {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT id,fname,lname,mname,contact,email,role,status,created,modified FROM ??', [cThis.table], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get staff by id and return the result object:
    findStaffById(id) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT id,fname,lname,mname,contact,email,role,status,created,modified FROM ?? WHERE id = ?', [cThis.table, id], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findAppointmentStatus(studentID) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT * FROM ?? WHERE studentid = ? AND status = pending OR status = reject', [cThis.table, studentID], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findAllByCol(myvar, val) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT * FROM ?? WHERE ?? = ?', [cThis.table, myvar, val], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findAllLikeStr(myvar, val) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT * FROM ?? WHERE ?? LIKE ? AND (status = "approve" OR status = "completed")', [cThis.table, myvar, val], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    findAllDTRLikeStr(myvar, val) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT * FROM ?? WHERE ?? LIKE ?', [cThis.table, myvar, val], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    fetchStudentsByVar(myvar, val) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT id,fname,lname,mname,SIT,course,yearsection FROM ?? WHERE ?? = ?', [cThis.table, myvar, val], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //get row by id and return the result object:
    fetchStudentsByCompanyStatAndVar(myvar, val) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('SELECT id,fname,lname,mname,SIT,course,yearsection FROM ?? WHERE CompanyStatus="approve" AND ?? = ?', [cThis.table, myvar, val], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //insert data via object such as {id: 1, title: 'Hello MySQL'} 
    create(data) {
        try {
            let cThis = this;
            return new Promise((myResolve, myReject) => {
                db.query('INSERT INTO ?? SET ?', [cThis.table, data], (error, result) => {
                    if (error) return myReject(error);
                    let data = cThis.find(result.insertId);
                    data.then((value) => { return myResolve(value) })
                        .catch((error) => { return myReject(error) });
                });
            });
        } catch (err) {
            return err;
        }

    }


    //update row and return new data as an object
    update(id, data) {
        try {
            let cThis = this;
            return new Promise(function (myResolve, myReject) {
                db.query('UPDATE  ?? SET ? WHERE id = ?', [cThis.table, data, id], (error, result) => {
                    if (error) return myReject(error);
                    let data = cThis.find(id);
                    data.then((value) => { return myResolve(value) })
                        .catch((error) => { return myReject(error) });

                });
            });
        } catch (err) {
            return err;
        }


    }

    //update row and return new data as an object
    updateNotifByVar(studentid, data) {
        try {
            let cThis = this;
            return new Promise(function (myResolve, myReject) {
                db.query('UPDATE ?? SET ? WHERE studentid = ?', [cThis.table, data, studentid], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //update row and return new data as an object
    updateByVar(compstat, compid, data) {
        try {
            let cThis = this;
            return new Promise(function (myResolve, myReject) {
                db.query('UPDATE ?? SET ? WHERE CompanyStatus = ? AND companyid = ?', [cThis.table, data, compstat, compid], (error, result) => {
                    if (error) return myReject(error);
                    return myResolve(result);
                });
            });
        } catch (err) {
            return err;
        }
    }

    //delete row and return info
    // {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}

    delete(id) {
        try {
            let cThis = this;
            return new Promise(function (myResolve, myReject) {
                db.query('DELETE FROM  ??  WHERE id = ?', [cThis.table, id], function (error, result) {
                    if (error) return myReject(error);
                    return myResolve(result)
                });
            });
        } catch (err) {
            return err;
        }
    }

    deleteByVar(myvar, id) {
        try {
            let cThis = this;
            return new Promise(function (myResolve, myReject) {
                db.query('DELETE FROM  ??  WHERE ? = ?', [cThis.table, myvar, id], function (error, result) {
                    if (error) return myReject(error);
                    return myResolve(result)
                });
            });
        } catch (err) {
            return err;
        }
    }
}