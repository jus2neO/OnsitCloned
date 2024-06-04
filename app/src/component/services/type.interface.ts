export interface ILogin {
    id: string;
    password: string;
}

export interface ICurrentStudent {
    id: string;
    token: string;
    fname: string;
    mname: string;
    lname: string;
    email: string;
    contact: string;
    status: string;
    address: string;
    civilstatus: string;
    birthdate: Date;
    age: number;
    sex: string;
    height: string;
    weight: string;
    collegedepartment: string;
    SIT: string;
    course: number;
    yearsection: number;
    fathersname: string;
    fathersaddress: string;
    fatherscontact: string;
    mothersname: string;
    mothersaddress: string;
    motherscontact: string;
    created: Date;
}

export interface ISITLevel {
    id: number;
    label: string;
    description: string;
    created: Date;
    modified: Date;
    enabled: boolean;
}

export interface ISITRequirement {
    id: number;
    sitlevel: number;
    label: string;
    description: string;
    created: Date;
    modified: Date;
    enabled: boolean;
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

export interface IStudent {
    SIT: string;
    address: string;
    contact: string;
    email: string;
    fname: string;
    id: string;
    isInit: boolean;
    lname: string;
    mname: string;
    status: string;
    civilstatus: string;
    birthdate: Date;
    age: number;
    sex: string;
    height: string;
    weight: string;
    collegedepartment: string;
    companyid: number;
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

export interface ISIT {
    id: number;
    label: string;
    description: string;
    created: Date;
    modified: Date | null;
    enabled: boolean;
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

export interface IStudentSITCompanyArchieve {
    id: number;
    studentid: string;
    companyid: number;
    sitid: number;
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

export interface ICompanyCoursePref {
    id: number;
    companyid: number;
    courseid: number;
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