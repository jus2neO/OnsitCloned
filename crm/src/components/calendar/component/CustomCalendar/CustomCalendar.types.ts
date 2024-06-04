export type Appointment = {
  id: number;
  status: string;
  studentName: string;
  email: string;
  contact: string;
  start: Date;
  end: Date;
};

export type Blockout = { id: number; name: string };

export type EventItem = {
  start: Date;
  end: Date;
  data?: { appointment?: Appointment; blockout?: Blockout };
  isDraggable?: boolean;
  isRizeable?: boolean;
};

export type EventItems = {
  start: Date;
  end: Date;
  data?: { 
    appointment?: Appointment;
    appointments?: Appointment[]; 
    blockout?: Blockout 
  };
  isDraggable?: boolean;
  isRizeable?: boolean;
};