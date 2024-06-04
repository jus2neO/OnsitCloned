import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import { onUploadStaffExcel, changeStaffPassword, getAllStaff, onUpdateStaff } from "../services/staffServices";
import { IStaff } from "../services/type.interface";
import copy from "copy-to-clipboard";
import "./staffacounts.scss";

export interface IStaffaccountsProps {
  staff?: IStaff;
}

const Staffaccounts = ({ staff }: IStaffaccountsProps) => {
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [currentstaffList, setcurrentStaffList] = useState<IStaff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<IStaff>();
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();
  const [formData, setFormData] = useState({
    search: ''
  });
  const { search } = formData;

  const token = "";

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any, events: any) => {
    setFile(acceptedFiles[0]);
  }, []);
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      files: [".xlsx", ".xlt", ".xls"]
    },
    onDrop
  });


  const onSubmitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (typeof file === 'undefined') return;

    const formData = new FormData();
    formData.append('excel', file);

    await onUploadStaffExcel("", formData).then((res: any) => {
      const mystaff = staffList;
      const successStaff = res.successData;
      const newStaff = mystaff.concat(successStaff);
      setStaffList(newStaff);
      setcurrentStaffList(newStaff);
    }).catch((err) => {
      console.log("Error: ", err.message);
    });
  }

  const onRemoveFile = (e: any) => {
    e.preventDefault();

    setFile(undefined);
  }

  const onCopyPassword = useCallback(() => {
    setIsCopied(true);
    if (password) copy(password);

  }, [password]);

  const onSelectStaff = async (staff: IStaff) => {
    setShowPassword(true);
    setSelectedStaff(staff);
    await changeStaffPassword("", staff.id).then((res: any) => {
      setPassword(res.password);
      const myStaff = staffList.find((s) => { return s.id === staff.id });
      const myCStaff = currentstaffList.find((s) => { return s.id === staff.id });
      if (myStaff) {
        myStaff.status = "active";
      }
      if (myCStaff) {
        myCStaff.status = "active";
      }

    }).catch((err) => {
      console.log("Error server: ", err.message);
    });
  }

  const onSubmitSearch = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.value) {
      const arr = staffList;
      const search = e.target.value;
      const res = arr.filter(str => str.fname.toLowerCase().includes(search.toLowerCase()) || str.lname.toLowerCase().includes(search.toLowerCase()) || str.mname.toLowerCase().includes(search.toLowerCase()));
      setcurrentStaffList(res);
    } else {
      setcurrentStaffList(staffList);
    }

  };

  const onGetAllStaff = async () => {
    await getAllStaff(token).then((res: any) => {
      setStaffList(res);
      setcurrentStaffList(res);
    }).catch(err => {
      console.log("Error: ", err);
    });
  }

  const onRoleChange = async (e: any, mystaff: IStaff) => {
    e.preventDefault();
    if (staff && staff.role !== 3) {
      let myStaff = mystaff;
      myStaff.role = Number(e.target.value);

      await onUpdateStaff(token, mystaff.id, myStaff).then((res: any) => {
        if (res) {
          const newStaff: IStaff[] = [];
          staffList.forEach((s) => {
            if (s.id === mystaff.id) {
              newStaff.push(res);
            } else {
              newStaff.push(s);
            }
          });

          setStaffList(newStaff);
          setcurrentStaffList(newStaff);
        }
      }).catch((err) => {
        console.log("Error: ", err);
      });
    }
  }

  useEffect(() => {
    onGetAllStaff();
  }, []);

  return (
    <section className="upload-container">
      <Modal
        showSubmitBtn={false}
        isForm={false}
        title="Review Student"
        cancelLabel="Close"
        submitLabel="Submit"
        isDisplay={showPassword}
        mysize='lg'
        onClickClose={(bol) => {
          setShowPassword(bol);
          setIsCopied(false);
        }} onClickSubmit={() => setShowPassword(false)}>
        <label>Student: {selectedStaff?.fname + " " + selectedStaff?.mname + " " + selectedStaff?.lname}</label>
        <div />
        <span>Password: <input className='student-pass-input' id="student-pass" type='password' value={password} /><button className='btn' onClick={onCopyPassword}>{isCopied ? <i className="bi bi-clipboard-check"></i> : <i className="bi bi-clipboard"></i>}</button>{isCopied ? <span> Copied to clipboard! </span> : null}</span>
      </Modal>
      {staff && staff.role !== 3 ?
        <form onSubmit={onSubmitForm}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop it here</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
            <span>Can only accept xlsx, xlt, xls files</span>
          </div>
          <aside>
            <h5>File</h5>
            {file?.name && file?.size && <span>{file?.name} - {file?.size} bytes <button type="button" className='btn btn-default' onClick={onRemoveFile}><i className='bi bi-x' /></button></span>}
          </aside>
          <button type='submit' className='btn btn-primary'>Submit File</button>
        </form>
        : null}


      <div className='student-list-container'>
        <form onSubmit={onSubmitSearch}>
          <div className="input-group mb-3">
            <input type="text" className="form-control" name="search" value={search} onChange={onChange} placeholder="Search staff" aria-label="Search staff" aria-describedby="button-addon2" />
            <button className="btn btn-outline-secondary" type="submit" id="button-addon2"><i className="bi bi-search"></i></button>
          </div>
        </form>
        <table>
          <tr>
            <th style={{ minWidth: "50px" }}></th>
            <th style={{ minWidth: "200px" }}>Name</th>
            <th style={{ minWidth: "200px" }}>Email</th>
            <th style={{ minWidth: "100px" }}>Contact</th>
            <th style={{ minWidth: "100px" }}>Level</th>
            <th style={{ minWidth: "100px" }}>Status</th>
            <th style={{ minWidth: "100px" }}></th>
          </tr>

          {currentstaffList?.length > 0 ? currentstaffList?.map((val, i) => (
            <tr key={"students-" + i}>
              <td></td>
              <td>{val.fname + " " + val.mname + " " + val.lname}</td>
              <td>{val.email}</td>
              <td>{val.contact}</td>
              <td>
                <select disabled={staff?.role === 3 ? true : false} className="form-control" name="role" id="role" defaultValue={val.role} value={val.role} onChange={(e) => onRoleChange(e, val)}>
                  <option disabled value={0}> -- select a role -- </option>
                  <option value={1}>Global Administrator</option>
                  <option value={2}>Administrator</option>
                  <option value={3}>Staff</option>
                </select>
              </td>
              <td>{val.status}</td>
              <td>
                {staff && staff.role !== 3 ? <button type='button' className='btn btn-link' onClick={() => onSelectStaff(val)}>Change password</button> : null}
              </td>
            </tr>
          )) : <h5>No records</h5>}

        </table>
      </div>
    </section>
  )
}

export default Staffaccounts