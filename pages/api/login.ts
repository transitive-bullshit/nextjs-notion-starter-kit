import { getIronSession } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '@/lib/session-config';

export default async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;

  const correctUsername = process.env.PREVIEW_USERNAME;
  const correctPassword = process.env.PREVIEW_PASSWORD;

  // Basic validation
  if (!username || !password || !correctUsername || !correctPassword) {
    console.error('Missing credentials in request body or environment variables');
    return res.status(400).json({ message: 'Missing credentials' });
  }

  // Check if password protection is even enabled. If not, don't allow login.
  const passwordProtectEnabled = process.env.PASSWORD_PROTECT === 'true';
  if (!passwordProtectEnabled) {
    console.warn('Attempted login when password protection is disabled.');
    return res.status(403).json({ message: 'Preview protection is not enabled.' });
  }

  // Validate credentials
  const isCorrectCredentials = username === correctUsername && password === correctPassword;

  if (isCorrectCredentials) {
    // Get/create the session
    const session = await getIronSession(req, res, sessionOptions);

    // Set session data
    session.isAuthenticated = true;
    await session.save();
    console.log(`User '${username}' successfully logged in.`);
    res.status(200).json({ message: 'Login successful' });
  } else {
    console.warn(`Failed login attempt for user '${username}'.`);
    res.status(401).json({ message: 'Invalid username or password' });
  }
}
