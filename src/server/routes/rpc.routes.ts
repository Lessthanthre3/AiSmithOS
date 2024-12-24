import { Router } from 'express';
import RPCController from '../api/rpc';

const router = Router();

// RPC routes
router.post('/assets/owner', RPCController.getAssetsByOwner);
router.post('/assets/group', RPCController.getAssetsByGroup);

export default router;
