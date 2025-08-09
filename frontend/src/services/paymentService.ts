import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Room management service
// const AUTH_API_URL = 'http://localhost:8001'; // Auth service - for future use

export interface Transaction {
  id: number;
  phone_number: string;
  amount: number;
  MpesaReceiptNumber: string;
  description: string;
  room_name?: string;  // Added room_name field
  timestamp: string;
  status: 'pending' | 'successful' | 'failed';  // Changed 'successful' back from 'SUCCESS'
  room_id?: string;
}

export interface MpesaPaymentRequest {
  phone_number: string;
  amount: number;
  room_id: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
}

class PaymentService {
  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/transactions/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Initiate MPESA STK Push
  async initiatePayment(paymentData: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    try {
      console.log(paymentData)
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/payments/stk-push/`, paymentData, {
              headers: {
                        'Authorization': `Bearer ${token}`
                      }
      });
      return {
        success: true,
        message: 'Payment request sent successfully',
        checkoutRequestId: response.data.CheckoutRequestID
      };
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  // Get user transactions (could be filtered by user ID if needed)
  async getUserTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/transactions/`);
      const transactions = response.data;
      
      // If we need to filter by user, we'd need to add user info to transactions
      // For now, return all transactions
      return transactions;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default PaymentService;