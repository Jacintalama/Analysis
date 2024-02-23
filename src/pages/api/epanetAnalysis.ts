import type { NextApiRequest, NextApiResponse } from 'next';
import { Project, Workspace, EN } from 'epanet-js'; // Import EN for enums

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { inpFileContent } = req.body;
  if (!inpFileContent) {
    return res.status(400).json({ error: 'No EPANET input file content provided.' });
  }

  try {
    const ws = new Workspace();
    const model = new Project(ws);

    // Make sure to await the writeFile completion
    await ws.writeFile('net1.inp', inpFileContent);
    await model.open('net1.inp', 'report.rpt', 'out.bin');
    await model.solveH();

    // Make sure you're using the correct enum for pressure
    const n11Index = model.getNodeIndex("11");
    let pressures = [];

    await model.openH();
    await model.initH(0);

    let tStep = Infinity;
    do {
      const cTime = await model.runH();
      // Replace 11 with the correct enum, like EN.PRESSURE
      const pressure = model.getNodeValue(n11Index, EN.PRESSURE); 
      pressures.push(`Current Time: ${cTime}, Node 11 Pressure: ${pressure.toFixed(2)}`);
      tStep = await model.nextH();
    } while (tStep > 0);

    await model.saveH();
    await model.closeH();
    model.close(); // Close the model

    res.status(200).json({ message: 'Analysis completed successfully.', pressures });
  } catch (error: unknown) {
    // Narrow the error to the Error type if it's an instance of Error
    if (error instanceof Error) {
      console.error('EPANET analysis error:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      // If it's not an Error instance or doesn't have a message, handle it as a generic error
      console.error('An unexpected error occurred:', error);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
}
