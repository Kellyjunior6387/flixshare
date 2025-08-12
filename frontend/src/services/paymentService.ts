import axios from 'axios';
import { getRoomBackendUrl } from '../config';

const API_BASE_URL = getRoomBackendUrl(); // Room management service
// const AUTH_API_URL = getAuthBackendUrl(); // Auth service - for future use

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
  // Get all transactions (filtered by current user)
  async getTransactions(): Promise<Transaction[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/payments/transactions/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  // Get user transactions (with proper authentication)
  async getUserTransactions(): Promise<Transaction[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/payments/transactions/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // The backend should already filter by user based on the token
      // but we can add additional client-side filtering if needed
      return response.data;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default PaymentService;