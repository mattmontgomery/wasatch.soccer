import { NextApiRequest, NextApiResponse } from "next";

import { extract } from "@extractus/oembed-extractor";

export default async function embed(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const url = req.query.url?.toString();
    const embedCode = url ? await extract(url, { maxwidth: 720 }) : null;
    res.json({ data: embedCode, meta: { url } });
  } catch (e) {
    res.status(500).json({
      errors: [String(e)],
    });
  }
}
