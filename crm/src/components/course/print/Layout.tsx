import { useEffect, useState, useMemo } from "react";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { getAllStudents } from "../../services/studentService";
import { getAllSIT } from "../../services/sitServices";
import { getAllCourse, getAllYearSection } from "../../services/courseServices";
import { IStudent, ICourse, IYearSection, ISIT } from "../../services/type.interface";

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    title: {
        fontSize: 22
    },
    subTest: {
        marginLeft: 20,
        fontSize: 14
    },
    company: {
        fontSize: 14
    },
    student: {
        fontSize: 12
    }
});

// 40 normal text until new page

const Layout = () => {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [yearSection, setYearSection] = useState<IYearSection[]>([]);
    const [sit, setSit] = useState<ISIT[]>([]);
    const [myorganizeList, setMyOrganizeList] = useState<any>();
    const token = "";

    const fetchStudents = async () => {
        await getAllStudents(token).then((res: any) => {
            setStudents(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const fetchCourse = async () => {
        await getAllCourse(token).then((res: any) => {
            setCourses(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const fetchYearSection = async () => {
        await getAllYearSection(token).then((res: any) => {
            setYearSection(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const fetchSIT = async () => {
        await getAllSIT(token).then((res: any) => {
            setSit(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const organizeList = () => {
        let mypage: any = [];
        let myhtml: any = { 0: [] };
        let pageCount = 0;
        let count = 1;
        courses.forEach((course, ind) => {
            const mysectyear = yearSection.filter((sect) => {return sect.courseid === course.id});

            mysectyear.forEach((secty) => {
                myhtml = { ...myhtml, [pageCount]: [...myhtml[pageCount], <Text key={"comp-" + ind} style={styles.company}>- {course.title + " " + secty.title}</Text>] };

                const mystudent = students.filter((stud) => { return stud.course === course.id && stud.yearsection === secty.id});

                mystudent.forEach((stud, inde) => {
                    myhtml = { ...myhtml, [pageCount]: [...myhtml[pageCount], <Text key={"stud-" + inde} style={styles.subTest}>* {stud.fname + " " + stud.mname + " " + stud.lname}</Text>] };
                    count += 1;
                });
            });

            
            /*myhtml = { ...myhtml, [pageCount]: [...myhtml[pageCount], <Text key={"comp-" + ind} style={styles.company}>- {comp.name}</Text>] };
            const mystudent = students.filter((stud) => { return stud.companyid === comp.id });
            count += 1;
            mystudent.forEach((stud, inde) => {
                const mysit = sit.find((s) => { return s.id === Number(stud.SIT) });
                const mycourse = course.find((c) => { return c.id === stud.companyid });
                const myyearsection = yearSection.find((y) => { return y.id === stud.yearsection });
                myhtml = { ...myhtml, [pageCount]: [...myhtml[pageCount], <Text key={"stud-" + inde} style={styles.subTest}>* {stud.fname + " " + stud.mname + " " + stud.lname + " SIT #: " + (mysit ? mysit?.label : "N/A") + " Course: " + (mycourse ? mycourse?.title : "N/A") + " " + (myyearsection ? myyearsection?.title : "N/A")}</Text>] };
                count += 1;
            });*/
            if (count === 50) {
                pageCount += 1;
                count = 0;
            }
        });
        for (let x in myhtml) {
            if (x === "0") {
                mypage.push(<Page size="A4" style={styles.page}><View style={styles.section}><Text style={styles.title}>Course Section Year and Student List</Text>{myhtml[x]}</View></Page>);
            } else {
                mypage.push(<Page size="A4" style={styles.page}><View style={styles.section}>{myhtml[x]}</View></Page>);
            }
        }
        setMyOrganizeList(mypage);
    }

    useMemo(() => {
        organizeList();
    }, [students, courses, yearSection, sit]);

    useEffect(() => {
        fetchStudents();
        fetchCourse();
        fetchYearSection();
        fetchSIT();
    }, []);
    return (
        <Document>
            {
                myorganizeList
            }
        </Document>
    )
}

export default Layout;