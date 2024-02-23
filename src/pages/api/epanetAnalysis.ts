// pages/api/epanetAnalysis.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Project, Workspace } from 'epanet-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { inpFileContent } = req.body;

    try {
        const ws = new Workspace();
        const model = new Project(ws);

        // Write input file content to workspace
        ws.writeFile("net1.inp", inpFileContent);

        // Open project
        model.open("net1.inp", "report.rpt", "out.bin");

        // Run hydraulic analysis
        model.openH();
        model.initH(11);
        let tStep = Infinity;
        const results: string[] = [];

        do {
            const cTime = model.runH();
            const hours = Math.floor(cTime / 3600);
            const minutes = Math.floor((cTime % 3600) / 60);
            const seconds = Math.floor(cTime % 60);

            const timeString = `${ hours }h ${ minutes }m ${ seconds } s`;

            const pressure = model.getNodeValue(model.getNodeIndex("11"), 11);
            results.push(`Current Time: - ${timeString}, Node 11 Pressure: ${pressure.toFixed(2)}`);
            tStep = model.nextH();
        } while (tStep > 0);

        model.saveH();
        model.closeH();

        res.status(200).json({ results: results.join('\n') });
    } catch (error) {
        console.error("Error during analysis:", error);
        res.status(500).json({ error: "An error occurred during analysis." });
    }
}
