import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import {
  AppointmentStatusCode,
  EVENT_STATUS_COLORS,
} from "./CustomCalendar.constants";
import { Appointment } from "./CustomCalendar.types";

export default function AppointmentEvent({
  appointment,
  appointments
}: {
  appointment: Appointment;
  appointments: Appointment[];
}) {
  const { contact, status, studentName, email } = appointment;
  const background = EVENT_STATUS_COLORS[status as AppointmentStatusCode];

  return (
    <Box bg={background} p={1} height="100%" color="black">
      <Flex alignItems={"center"} justifyContent="space-between">
        <Flex>
          <Text fontSize="xs">{contact}</Text>
        </Flex>
        <Flex>
          <Text fontSize="xs">{studentName}</Text>
        </Flex>
        <Flex>
          <Text fontSize="xs">{email}</Text>
        </Flex>
      </Flex>
      <Flex alignItems={"center"} justifyContent="space-between">
      <Flex>
          <Text fontSize="xs">{contact}</Text>
        </Flex>
        <Flex>
          <Text fontSize="xs">Students Count{"("+appointments.length+")"}</Text>
        </Flex>
        <Flex>
          <Text fontSize="xs">{email}</Text>
        </Flex>
      </Flex>
    </Box>
  );
}
