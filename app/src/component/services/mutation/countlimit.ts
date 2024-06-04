import { IAppointment } from "../type.interface";

/*
<option value={"08:00-09:45"}>08:00am to 9:45am</option>
<option value={"10:00-11:45"}>10:00am to 11:45am</option>
<option value={"13:00-14:45"}>01:00pm to 2:45pm</option>
<option value={"15:00-16:45"}>03:00pm to 04:45pm</option>
*/

export const getListOfCountLimit = (apps: IAppointment[]) => {
    let listOfLimit: number[] = [];
    const listoftime = ["8:", "10:", "13:", "15:"];

    listoftime.forEach((list) => {
        const myapps = apps.filter((app) => {return app.start.includes(list)});
        listOfLimit.push(myapps.length);
    });

    return listOfLimit;
}