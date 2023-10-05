import { NextApiRequest, NextApiResponse } from 'next'
import { domain, } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("erwertew", req);
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed here' })
  }
  console.log('req query here', req, req.body);
  const { pageId } = req.body;
  console.log('req page id here', pageId);

  const props = await resolveNotionPage(domain, pageId)
  return res.status(200).json(props);
}