// pages/api/epanetAnalysis.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Project, Workspace, CountType, NodeProperty } from 'epanet-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { inpFileContent, analysisType } = req.body;

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
        let nodeResults: { [nodeId: string]: string[] } = {};

        do {
            let currentTime = model.runH();
            const hours = Math.floor(currentTime / 3600);
            const minutes = Math.floor((currentTime % 3600) / 60);
            const seconds = Math.floor(currentTime % 60);
            const timeString = `${hours}h ${minutes}m ${seconds}s`;
            for (let i = 1; i <= nodeCount; i++) {
                const nodeId: string = model.getNodeId(i);
                let value: number;
                let valueName: string;
                switch (analysisType) {
                    case 'pressure':
                        value = model.getNodeValue(i, NodeProperty.Pressure);
                        valueName = 'Pressure'
                        break;
                    case 'demand':
                        value = model.getNodeValue(i, NodeProperty.Demand);
                        valueName = 'Demand'
                        break;
                    case 'head':
                        value = model.getNodeValue(i, NodeProperty.Head);
                        valueName = 'Head'
                        break;
                    // case 'emitter':
                    //         value = model.getNodeValue(i, NodeProperty.Emitter);
                    //         valueName = 'Emitter Flows'
                    //         break;
                    default:
                        value = model.getNodeValue(i, NodeProperty.Pressure); // Default to pressure if analysisType is unrecognized
                        valueName = 'Pressure'
                }

                if (!nodeResults[nodeId]) {
                    nodeResults[nodeId] = []; // Initialize array if not already done
                }
                // Append time and value to the node's array
                nodeResults[nodeId].push(`Current Time: ${timeString}, ${valueName}: ${value.toFixed(2)}`);
            }

            hydraulicTimeStep = model.nextH();
        } while (hydraulicTimeStep > 0);

        // Compile results
        const results: string[] = [];
        for (const [nodeId, values] of Object.entries(nodeResults)) {
            results.push(`Node ${nodeId}:`);
            values.forEach(valueInfo => results.push(valueInfo));
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
