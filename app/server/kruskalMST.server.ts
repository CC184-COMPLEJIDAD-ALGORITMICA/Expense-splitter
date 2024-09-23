import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface Node {
  id: string;
  balance: number;
  currency: string;
  preferredExchangeHouse?: string;
}

interface ExchangeHouse {
  name: string;
  rates: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  }[];
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface TransferRequirement {
  from: string;
  to: string;
  amount: number;
  cost: number;
}

interface OptimizationResult {
  mst: Edge[];
  totalWeight: number;
  totalCost: number;
  updatedNodes: Node[];
  logs: string[];
}

interface BalanceOption {
  type: 'equalize' | 'empty';
  targetAccount?: string;
}

export async function executeKruskalMST(
  nodes: Node[], 
  exchangeHouses: ExchangeHouse[], 
  balanceOption: BalanceOption
): Promise<OptimizationResult> {
  try {
    console.log("Ejecutando Kruskal MST con:", { nodes, exchangeHouses, balanceOption });
    
    const tempFilePath = path.join(process.cwd(), 'temp_data.json');
    await writeFile(tempFilePath, JSON.stringify({ 
      nodes, 
      exchangeHouses, 
      balanceOption
    }));

    const pythonScriptPath = path.join(process.cwd(), 'kruskal_mst.py');
    const { stdout, stderr } = await execAsync(`python "${pythonScriptPath}" "${tempFilePath}"`);

    if (stderr) {
      console.log("Información de depuración del script Python:", stderr);
    }

    const result: OptimizationResult = JSON.parse(stdout);
    console.log("Resultado de Kruskal MST:", result);

    return result;
  } catch (error) {
    console.error('Error executing Kruskal MST:', error);
    throw error;
  }
}
