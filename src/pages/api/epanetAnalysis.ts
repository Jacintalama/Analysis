// pages/api/epanetAnalysis.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Project, Workspace } from 'epanet-js';
import { CountType } from 'epanet-js';
import { NodeProperty } from 'epanet-js';

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
      
        const nodeCount: number = model.getCount(CountType.NodeCount);
        let hydraulicTimeStep: number = Infinity;
        let nodePressures: { [nodeId: string]: string[] } = {};
    
        const results: string[] = [];
   
        do {
            let currentTime = model.runH();
            const hours = Math.floor(currentTime / 3600);
            const minutes = Math.floor((currentTime % 3600) / 60);
            const seconds = Math.floor(currentTime % 60);

            const timeString = `${ hours }h ${ minutes }m ${ seconds } s`;
            for (let i = 1; i <= nodeCount; i++) {
                const nodeId: string = model.getNodeId(i);
                const pressure: number = model.getNodeValue(i, NodeProperty.Pressure);
                
                if (!nodePressures[nodeId]) {
                  nodePressures[nodeId] = []; // Initialize array if not already done
                }
                // Append time and pressure to the node's array
                nodePressures[nodeId].push(`Current Time: ${timeString}, Pressure: ${pressure.toFixed(2)}`);
              }
            // results.push(`Current Time: - ${timeString}, Node 11 Pressure: ${pressure.toFixed(2)}`);
            hydraulicTimeStep = model.nextH();
        } while (hydraulicTimeStep > 0);

        for (const [nodeId, pressures] of Object.entries(nodePressures)) {
            results.push(`Node ${nodeId}:`);
            pressures.forEach(pressureInfo => {
              results.push(pressureInfo)
            });
             results.push('----------------------------------------------');
          }
          

        model.saveH();
        model.closeH();

        res.status(200).json({ results: results.join('\n') });
    } catch (error) {
        console.error("Error during analysis:", error);
        res.status(500).json({ error: "An error occurred during analysis." });
    }
}
