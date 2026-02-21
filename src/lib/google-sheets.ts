import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";
import type {
  Customer,
  CustomerInput,
  Booking,
  BookingInput,
  LessonNote,
  NoteInput,
} from "./types";

function getAuth(): JWT {
  const keyJson = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64!, "base64").toString()
  );
  return new JWT({
    email: keyJson.client_email,
    key: keyJson.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets(): sheets_v4.Sheets {
  return google.sheets({ version: "v4", auth: getAuth() });
}

const SPREADSHEET_ID = () => process.env.GOOGLE_SHEETS_ID!;

// ==================== Customers ====================

export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "customers!A:G",
  });
  const rows = res.data.values;
  if (!rows || rows.length < 2) return null;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[2] === email) {
      return {
        customerId: row[0],
        name: row[1],
        email: row[2],
        phone: row[3],
        firstVisit: row[4],
        totalVisits: parseInt(row[5]) || 0,
        memo: row[6] || "",
      };
    }
  }
  return null;
}

export async function createCustomer(data: CustomerInput): Promise<Customer> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID(),
    range: "customers!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          data.customerId,
          data.name,
          data.email,
          data.phone,
          data.firstVisit,
          data.totalVisits,
          data.memo,
        ],
      ],
    },
  });
  return data;
}

export async function updateCustomerVisits(customerId: string): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "customers!A:G",
  });
  const rows = res.data.values;
  if (!rows) return;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === customerId) {
      const currentVisits = parseInt(rows[i][5]) || 0;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID(),
        range: `customers!F${i + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[currentVisits + 1]],
        },
      });
      return;
    }
  }
}

export async function getCustomer(customerId: string): Promise<Customer | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "customers!A:G",
  });
  const rows = res.data.values;
  if (!rows) return null;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === customerId) {
      return {
        customerId: rows[i][0],
        name: rows[i][1],
        email: rows[i][2],
        phone: rows[i][3],
        firstVisit: rows[i][4],
        totalVisits: parseInt(rows[i][5]) || 0,
        memo: rows[i][6] || "",
      };
    }
  }
  return null;
}

export async function getCustomers(): Promise<Customer[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "customers!A:G",
  });
  const rows = res.data.values;
  if (!rows || rows.length < 2) return [];

  return rows.slice(1).map((row) => ({
    customerId: row[0],
    name: row[1],
    email: row[2],
    phone: row[3],
    firstVisit: row[4],
    totalVisits: parseInt(row[5]) || 0,
    memo: row[6] || "",
  }));
}

export async function updateCustomerMemo(
  customerId: string,
  memo: string
): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "customers!A:G",
  });
  const rows = res.data.values;
  if (!rows) return;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === customerId) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID(),
        range: `customers!G${i + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[memo]],
        },
      });
      return;
    }
  }
}

// ==================== Bookings ====================

export async function createBooking(data: BookingInput): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID(),
    range: "bookings!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          data.bookingId,
          data.customerId,
          data.date,
          data.startTime,
          data.status,
          data.calendarEventId,
          data.cancelToken,
          data.createdAt,
        ],
      ],
    },
  });
}

export async function updateBookingStatus(
  bookingId: string,
  status: string
): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "bookings!A:H",
  });
  const rows = res.data.values;
  if (!rows) return;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === bookingId) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID(),
        range: `bookings!E${i + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[status]],
        },
      });
      return;
    }
  }
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "bookings!A:H",
  });
  const rows = res.data.values;
  if (!rows || rows.length < 2) return [];

  return rows
    .slice(1)
    .filter((row) => row[2] === date && row[4] === "confirmed")
    .map((row) => ({
      bookingId: row[0],
      customerId: row[1],
      date: row[2],
      startTime: row[3],
      status: row[4] as Booking["status"],
      calendarEventId: row[5],
      cancelToken: row[6],
      createdAt: row[7],
    }));
}

export async function getBookingsByCustomer(customerId: string): Promise<Booking[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "bookings!A:H",
  });
  const rows = res.data.values;
  if (!rows || rows.length < 2) return [];

  return rows
    .slice(1)
    .filter((row) => row[1] === customerId)
    .map((row) => ({
      bookingId: row[0],
      customerId: row[1],
      date: row[2],
      startTime: row[3],
      status: row[4] as Booking["status"],
      calendarEventId: row[5],
      cancelToken: row[6],
      createdAt: row[7],
    }));
}

// ==================== Lesson Notes ====================

export async function createLessonNote(data: NoteInput): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID(),
    range: "lesson_notes!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          data.noteId,
          data.customerId,
          data.date,
          data.content,
          data.nextAction,
          data.createdAt,
        ],
      ],
    },
  });
}

export async function getLessonNotesByCustomer(
  customerId: string
): Promise<LessonNote[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: "lesson_notes!A:F",
  });
  const rows = res.data.values;
  if (!rows || rows.length < 2) return [];

  return rows
    .slice(1)
    .filter((row) => row[1] === customerId)
    .map((row) => ({
      noteId: row[0],
      customerId: row[1],
      date: row[2],
      content: row[3],
      nextAction: row[4],
      createdAt: row[5],
    }));
}
