import { Request, Response } from 'express';
import axios from 'axios';

const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY;
const RPC_ENDPOINT = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export class RPCController {
  async getAssetsByOwner(req: Request, res: Response) {
    try {
      const { owner } = req.body;
      
      if (!owner) {
        return res.status(400).json({ error: 'Owner address is required' });
      }

      const response = await axios.post(RPC_ENDPOINT, {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: owner,
          page: 1,
          limit: 1000
        }
      });

      return res.json(response.data);
    } catch (error) {
      console.error('RPC Error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch assets',
        details: error.message 
      });
    }
  }

  async getAssetsByGroup(req: Request, res: Response) {
    try {
      const { groupKey, groupValue } = req.body;
      
      if (!groupKey || !groupValue) {
        return res.status(400).json({ 
          error: 'Both groupKey and groupValue are required' 
        });
      }

      const response = await axios.post(RPC_ENDPOINT, {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByGroup',
        params: {
          groupKey,
          groupValue,
          page: 1,
          limit: 1000
        }
      });

      return res.json(response.data);
    } catch (error) {
      console.error('RPC Error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch assets by group',
        details: error.message 
      });
    }
  }

  async getAsset(req: Request, res: Response) {
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Asset ID is required' });
      }

      const response = await axios.post(RPC_ENDPOINT, {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAsset',
        params: { id }
      });

      return res.json(response.data);
    } catch (error) {
      console.error('RPC Error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch asset',
        details: error.message 
      });
    }
  }
}

export default new RPCController();
