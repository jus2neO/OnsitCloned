import { ChakraProvider } from "@chakra-ui/react";
import DragAndDrop from "./component/DragAndDrop/DragAndDrop";

const Calendar = () => {
  return (
    <ChakraProvider>
      <div style={{ height: "100vh" }}>
        {/* <Calendar /> */}
        {/* <CustomCalendar /> */}
        {/* <CalendarSteps /> */}
        <DragAndDrop />
      </div>
    </ChakraProvider>
  )
}

export default Calendar;