import { useEffect, Fragment, useState, useCallback, useMemo } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { getAllSIT } from "../../services/sitServices";
import { getAllCompany } from "../../services/companyServices";
import { getAllCourse, getAllYearSection } from "../../services/courseServices";
import { IStudent, ICourse, IYearSection, ISIT, ICompany } from "../../services/type.interface";

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const Booklet = () => {
    const [student, setStudent] = useState<IStudent>();
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [companys, setCompanys] = useState<ICompany[]>([]);
    const [yearSection, setYearSection] = useState<IYearSection[]>([]);
    const [sit, setSit] = useState<ISIT[]>([]);
    const [myorganizeList, setMyOrganizeList] = useState<any>();
    const token = "";

    const fetchCourse = async () => {
        await getAllCourse(token).then((res: any) => {
            setCourses(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const fetchCompanys = async () => {
        await getAllCompany(token).then((res: any) => {
            setCompanys(res);
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

    const organizingBooklet = () => {
        let mypage: any = [];
        const mycourse = courses.find((c) => { return c.id === student?.course });
        const myyearsection = yearSection.find((c) => { return c.id === student?.yearsection });
        const mysit = sit.find((c) => { return c.id === Number(student?.SIT) });
        const mycompany = companys.find((c) => { return c.id === Number(student?.companyid) });
        mypage.push(
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={{ fontSize: "56px", marginTop: "50px", textAlign: "center" }}>SIT Booklet</Text>
                    <Text style={{ fontSize: "12px", marginTop: "400px" }}>Student: {student?.fname + " " + student?.mname + " " + student?.lname}</Text>
                    <Text style={{ fontSize: "12px" }}>Course: {mycourse?.title + " " + myyearsection?.title}</Text>
                    <Text style={{ fontSize: "12px" }}>SIT: {mysit?.label}</Text>
                    <Text style={{ fontSize: "12px" }}>Company: {mycompany?.name}</Text>
                </View>
            </Page>
        );

        mypage.push(
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</Text>
                    <Text>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</Text>
                </View>
            </Page>
        );

        mypage.push(
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</Text>
                    <Text>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</Text>
                </View>
            </Page>
        );

        /*<Fragment>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={{fontSize: "56px", textAlign: "center"}}>SIT Booklet</Text>
                    <Text style={{fontSize: "14px"}}>Created for: </Text>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Fragment>*/

        setMyOrganizeList(mypage);
    };

    useMemo(() => {
        organizingBooklet();
    }, [student, courses, yearSection, sit, companys]);

    useEffect(() => {
        const myapp = localStorage.getItem("currentstudent");
        if (myapp) {
            setStudent(JSON.parse(myapp));
        }
        fetchCourse();
        fetchYearSection();
        fetchSIT();
        fetchCompanys();
    }, []);
    return (
        <Document>
            {myorganizeList}
        </Document>
    )
}

export default Booklet;