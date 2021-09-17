import { NextApiRequest, NextApiResponse } from 'next'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  
  console.log(req.body, "\n");
  return res.status(200).json({name:"200"});
}
