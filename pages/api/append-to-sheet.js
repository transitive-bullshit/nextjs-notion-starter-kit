import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Extract data from the request body
    const { topic, email } = req.body;

    // 2. Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 3. Append the row [topic, email] (feel free to add more columns)
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID, // from your .env.local
      range: 'Sheet1!A1',                        // or wherever you'd like to append
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [topic, email ?? ''], // If email is undefined, store an empty cell
        ],
      },
    });

    return res.status(200).json({ status: 'success', data: response.data });
  } catch (error) {
    console.error('Error appending to sheet:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
