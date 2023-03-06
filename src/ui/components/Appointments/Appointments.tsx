import React from "react";
import styled from "styled-components";

const Root = styled.div``;

export interface IAppointmentProps {}

function AppointmentFunc({}: IAppointmentProps) {
  return <Root></Root>;
}

export const Appointments = React.memo(AppointmentFunc);
