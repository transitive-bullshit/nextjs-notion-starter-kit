import { google } from 'googleapis';

/**
 * Body: { courseName, name, email, comment }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { courseName, name, email, comment } = req.body;
    if (!courseName) return res.status(400).json({ message: 'courseName required' });

    // 1 – Google auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // 2 – Does the sheet already exist?
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = meta.data.sheets.find(
      (s) => s.properties.title === courseName,
    );

    if (!sheet) {
      // Create new sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: courseName },
            }},
          ],
        },
      });
      // Optional: write header row once
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${courseName}'!A1:D1`,
        valueInputOption: 'RAW',
        requestBody: { values: [['Timestamp', 'Name', 'Email', 'Comment']] },
      });
    }

    // 3 – Append the feedback
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${courseName}'!A:D`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [new Date().toISOString(), name, email, comment],
        ],
      },
    });

    return res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error('append-course-feedback:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
