import express from 'express';
import { getRaffleData, addTicket, updateRaffleData } from '../utils/dataStore.js';
import { verifyTransaction, waitForConfirmation } from '../utils/solanaUtils.js';

const router = express.Router();

const RAFFLE_WALLET_ADDRESS = 'F2NMjJX7xHfKWfgAEv9uATcgx2nabzDFkKtk8szoJASN';
const TICKET_PRICE = 0.1; // SOL

// Get current raffle status
router.get('/status', async (req, res) => {
  try {
    const data = await getRaffleData();
    res.json(data.currentRaffle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get raffle status' });
  }
});

// Add new ticket
router.post('/buy-ticket', async (req, res) => {
  try {
    const { walletAddress, ticketNumber, price, signature } = req.body;
    
    // Wait for transaction confirmation
    const confirmed = await waitForConfirmation(signature);
    if (!confirmed) {
      return res.status(400).json({ error: 'Transaction failed to confirm' });
    }
    
    // Verify the transaction
    const verification = await verifyTransaction(
      signature,
      price,
      walletAddress,
      RAFFLE_WALLET_ADDRESS
    );
    
    if (!verification.verified) {
      return res.status(400).json({ 
        error: 'Transaction verification failed',
        details: verification.error 
      });
    }
    
    const ticket = {
      number: ticketNumber,
      walletAddress,
      price,
      purchaseTime: verification.timestamp,
      signature,
      verificationDetails: {
        confirmedAt: verification.timestamp,
        amount: verification.amount,
        sender: verification.sender,
        receiver: verification.receiver
      }
    };
    
    const updatedRaffle = await addTicket(ticket);
    res.json(updatedRaffle);
  } catch (error) {
    console.error('Failed to buy ticket:', error);
    res.status(500).json({ 
      error: 'Failed to buy ticket',
      details: error.message 
    });
  }
});

// Draw winner
router.post('/draw-winner', async (req, res) => {
  try {
    const data = await getRaffleData();
    if (!data.currentRaffle.isActive) {
      return res.status(400).json({ error: 'Raffle is not active' });
    }
    
    if (data.currentRaffle.tickets.length === 0) {
      return res.status(400).json({ error: 'No tickets purchased' });
    }
    
    const winningTicket = data.currentRaffle.tickets[
      Math.floor(Math.random() * data.currentRaffle.tickets.length)
    ];
    
    data.currentRaffle.winningNumber = winningTicket.number;
    data.currentRaffle.isActive = false;
    data.currentRaffle.endTime = new Date().toISOString();
    
    // Archive current raffle
    data.pastRaffles.push({ ...data.currentRaffle });
    
    await updateRaffleData(data);
    res.json(data.currentRaffle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to draw winner' });
  }
});

// Reset raffle
router.post('/reset', async (req, res) => {
  try {
    const data = await getRaffleData();
    data.currentRaffle = {
      tickets: [],
      prizePool: 0,
      isActive: true,
      winningNumber: null,
      startTime: new Date().toISOString(),
      endTime: null
    };
    
    await updateRaffleData(data);
    res.json(data.currentRaffle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset raffle' });
  }
});

// Get past raffles
router.get('/history', async (req, res) => {
  try {
    const data = await getRaffleData();
    res.json(data.pastRaffles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get raffle history' });
  }
});

export default router;
