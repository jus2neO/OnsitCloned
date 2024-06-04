const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const onMutateMonthToWord = (date: Date) => {
    return months[date.getMonth()];
}

export const onMutateTime = (date: Date) => {
    let myTime = '';
    let myHrs = date.getHours().toString().length === 1 ? "0"+date.getHours().toString() : date.getHours().toString();
    let myMins = date.getMinutes().toString().length === 1 ? "0"+date.getMinutes().toString() : date.getMinutes().toString();
    let ampm = "am";

    if(date.getHours() > 12){
        const hrs = date.getHours() - 12;
        myHrs = hrs.toString().length === 1 ? "0"+hrs.toString() : hrs.toString();
        ampm = "pm";
    }
    myTime = myHrs + ":" + myMins + " " + ampm;
    return myTime
}

export const onMutateDateFormat = (date: Date) => {
    let myDateTime = '';
    const myMonth = onMutateMonthToWord(date);
    const myDay = date.getDate().toString().length === 1 ? "0" + date.getDate().toString() : date.getDate().toString();
    const myYear = date.getFullYear().toString();

    myDateTime = days[date.getDay()] + " " + myMonth + " " + myDay + " " + myYear;

    return myDateTime;
}

export const onMutateDateTimeFormat = (date: Date) => {
    let myDateTime = '';
    const myMonth = onMutateMonthToWord(date);
    const myDay = date.getDate().toString().length === 1 ? "0" + date.getDate().toString() : date.getDate().toString();
    const myYear = date.getFullYear().toString();
    const time = onMutateTime(date);

    myDateTime = myMonth + " " + myDay + " " + myYear + " " + time;

    return myDateTime;
}