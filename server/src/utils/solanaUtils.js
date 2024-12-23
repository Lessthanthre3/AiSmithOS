import * as web3 from '@solana/web3.js';

const connection = new web3.Connection(
  web3.clusterApiUrl('mainnet-beta'),
  'confirmed'
);

export async function verifyTransaction(signature, expectedAmount, expectedSender, expectedReceiver) {
  try {
    // Wait for transaction confirmation
    const confirmation = await connection.confirmTransaction(signature);
    if (confirmation.value.err) {
      throw new Error('Transaction failed to confirm');
    }

    // Get transaction details
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Verify transaction details
    const transactionMeta = transaction.meta;
    if (!transactionMeta) {
      throw new Error('Transaction metadata not found');
    }

    // Verify sender and receiver
    const instructions = transaction.transaction.message.instructions;
    if (instructions.length === 0) {
      throw new Error('No instructions found in transaction');
    }

    const transferInstruction = instructions[0];
    if (!transferInstruction.programId.equals(web3.SystemProgram.programId)) {
      throw new Error('Not a system transfer');
    }

    // Get accounts involved in the transaction
    const accounts = transaction.transaction.message.accountKeys;
    const sender = accounts[0].toBase58();
    const receiver = accounts[1].toBase58();

    if (sender !== expectedSender) {
      throw new Error('Invalid sender');
    }

    if (receiver !== expectedReceiver) {
      throw new Error('Invalid receiver');
    }

    // Verify amount
    const lamports = transactionMeta.preBalances[0] - transactionMeta.postBalances[0];
    const solAmount = lamports / web3.LAMPORTS_PER_SOL;

    if (Math.abs(solAmount - expectedAmount) > 0.000001) { // Allow small rounding differences
      throw new Error(`Invalid amount. Expected ${expectedAmount} SOL, got ${solAmount} SOL`);
    }

    // Get block time
    const blockTime = transaction.blockTime;
    
    return {
      verified: true,
      timestamp: blockTime ? new Date(blockTime * 1000).toISOString() : new Date().toISOString(),
      sender,
      receiver,
      amount: solAmount,
      signature
    };

  } catch (error) {
    console.error('Transaction verification failed:', error);
    return {
      verified: false,
      error: error.message
    };
  }
}

export async function getTransactionStatus(signature) {
  try {
    const status = await connection.getSignatureStatus(signature);
    return {
      confirmed: status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized',
      status: status.value?.confirmationStatus || 'unknown'
    };
  } catch (error) {
    console.error('Failed to get transaction status:', error);
    return {
      confirmed: false,
      status: 'error',
      error: error.message
    };
  }
}

// Utility to wait for transaction confirmation with timeout
export async function waitForConfirmation(signature, timeoutSeconds = 30) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutSeconds * 1000) {
    const status = await getTransactionStatus(signature);
    
    if (status.confirmed) {
      return true;
    }
    
    if (status.status === 'error') {
      return false;
    }
    
    // Wait for 2 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Transaction confirmation timeout');
}
