export interface IStudent {
    SIT: number | null;
    address: string;
    contact: string;
    email: string;
    fname: string;
    id: string;
    isInit: boolean;
    lname: string;
    mname: string;
    studentphoto: string;
    status: string;
    civilstatus: string;
    birthdate: Date;
    age: number;
    sex: string;
    height: string;
    weight: string;
    collegedepartment: string;
    companyid: number | null;
    CompanyStatus: string;
    course: number;
    yearsection: number;
    fathersname: string;
    fathersaddress: string;
    fatherscontact: string;
    mothersname: string;
    mothersaddress: string;
    motherscontact: string;
    companystatusdate: Date;
}

export interface IStudentWithCourseYearSection {
    SIT: number | null;
    address: string;
    contact: string;
    email: string;
    fname: string;
    id: string;
    isInit: boolean;
    lname: string;
    mname: string;
    studentphoto: string;
    status: string;
    civilstatus: string;
    birthdate: Date;
    age: number;
    sex: string;
    height: string;
    weight: string;
    collegedepartment: string;
    companyid: number | null;
    course: number;
    yearsection: number;
    fathersname: string;
    fathersaddress: string;
    fatherscontact: string;
    mothersname: string;
    mothersaddress: string;
    motherscontact: string;
    CompanyStatus: string;
    companystatusdate: Date;
    mycourse: ICourse;
    myyearsection: IYearSection;
}

export interface IStudentSITCompanyArchieve {
    id: number;
    studentid: string;
    companyid: number;
    sitid: number;
    created: Date;
    modified: Date;
}

export interface IStudentSITCompany {
    id: number;
    studentid: string;
    companyid: number;
    sitid: number;
    created: Date;
    modified: Date;
}

export interface ISIT {
    id: number;
    label: string;
    description: string;
    created: Date;
    modified: Date | null;
    enabled: boolean;
}

export interface ISITRequirement {
    id: number;
    sitlevel: number;
    label: string;
    description: string;
    created: Date;
    modified: Date | null;
    enabled: boolean;
}

export interface ISITRequirementOptions {
    id: number;
    isChecked: boolean;
    label: string;
}

export interface IAppointment {
    id: number;
    studentid: string;
    start: string;
    end: string;
    sitlevel: number;
    status: string;
    note: string;
    created: Date;
    modified: Date;
    modifiedby: number;
    appointmentsFiles: IAppointmentFile[];
    student: IStudent;
    sit: ISIT;
}

export interface IAppointmentFile {
    id: number;
    appointmentid: number;
    filename: string;
    size: string;
    type: string;
    file: string;
    created: Date;
    modified: Date;
}

export interface ICourse {
    id: number;
    title: string;
    description: string;
    enabled: boolean;
    created: Date;
    modified: Date;
}

export interface IYearSection {
    id: number;
    courseid: number;
    title: string;
    enabled: boolean;
    created: Date;
    modified: Date;
}

export interface ICompany {
    id: number;
    name: string;
    description: string;
    slot: number;
    iconname: string;
    size: string;
    filetype: string;
    icon: string;
    enabled: boolean;
    expiration: Date;
    created: Date;
    modified: Date;
}

export interface ICompanyPrefer {
    id: number;
    companyid: number;
    courseid: number;
    created: Date;
    modified: Date;
}

export interface ICheckBox {
    value: string;
    label: string;
    isSelected: boolean;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IStaff {
    id: string;
    token: string;
    fname: string;
    mname: string;
    lname: string;
    email: string;
    contact: string;
    status: string;
    role: number;
    created: Date;
    modified: Date;
}

export interface ISITGrade {
    id: number;
    studentid: string;
    studentarchieceid: number;
    filename: string;
    size: string;
    type: string;
    file: string;
    created: Date;
    modified: Date;
}

export interface ISettings {
    id: number;
    start: Date;
    end: Date;
    slotlimit: number;
    issaturdayopen: boolean;
    enabled: boolean;
}

export interface IDTR {
    id: number;
    description: string;
    start: string;
    end: string;
    studentid: string;
    appoinrmentid: number;
    sitid: number;
    created: Date;
    modified: Date;
}

export interface INotification {
    id: number;
    studentid: string;
    companyid: number;
    description: string;
    isread: boolean;
    link: string;
    created: Date;
    modified: Date;
}