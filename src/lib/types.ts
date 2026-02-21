// --- Slot ---
export interface Slot {
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  available: boolean;
}

// --- Booking ---
export interface BookingData {
  clientRequestId: string;
  bookingId: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  name: string;
  email: string;
  phone: string;
  message?: string;
  isFirstVisit?: boolean;
  accessToken: string;
  cancelToken: string;
}

export interface BookingInput {
  bookingId: string;
  customerId: string;
  date: string;
  startTime: string;
  status: "confirmed" | "cancelled" | "completed";
  calendarEventId: string;
  cancelToken: string;
  createdAt: string;
}

export interface Booking {
  bookingId: string;
  customerId: string;
  date: string;
  startTime: string;
  status: "confirmed" | "cancelled" | "completed";
  calendarEventId: string;
  cancelToken: string;
  createdAt: string;
}

// --- Customer ---
export interface CustomerInput {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  firstVisit: string;
  totalVisits: number;
  memo: string;
}

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  firstVisit: string;
  totalVisits: number;
  memo: string;
}

// --- Lesson Note ---
export interface NoteInput {
  noteId: string;
  customerId: string;
  date: string;
  content: string;
  nextAction: string;
  createdAt: string;
}

export interface LessonNote {
  noteId: string;
  customerId: string;
  date: string;
  content: string;
  nextAction: string;
  createdAt: string;
}

// --- API Request/Response ---
export interface BookRequestBody {
  clientRequestId: string;
  date: string;
  startTime: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  honeypot?: string;
  isFirstVisit?: boolean;
}

export interface BookResponse {
  success: boolean;
  bookingId: string;
  date: string;
  startTime: string;
}

export interface AvailabilityResponse {
  date: string;
  slots: Slot[];
}
