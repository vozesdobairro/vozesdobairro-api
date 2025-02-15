import { Injectable } from '@nestjs/common';
import { CreateWiseDto } from './dto/create-wise.dto';
import { UpdateWiseDto } from './dto/update-wise.dto';
import axios from 'axios';

@Injectable()
export class WiseService {
  private API_URL = 'https://api.transferwise.com';
  private API_KEY = '9aa8104b-ed89-42ee-b461-afaff1d7565c';

  async createRecipient() {
    const response = await axios.post(
      `${this.API_URL}/v1/accounts`,
      {
        profile: '28642689',
        currency: 'USD',
        type: 'aba',
        details: {
          legalType: 'PRIVATE',
          accountHolderName: 'Vozes do Bairro',
          abartn: '111000025',
          accountNumber: '123456789',
        },
      },
      { headers: { Authorization: `Bearer ${this.API_KEY}` } },
    );
    return response.data.id; // Return recipient ID
  }

  async generatePaymentLink() {
    const response = await axios.post(
      `${this.API_URL}/v1/payment-links`,
      {
        amount: '50',
        currency: 'USD',
        targetCurrency: 'EUR',
        recipientEmail: 'vozesdobairro@gmail.com',
      },
      { headers: { Authorization: `Bearer ${this.API_KEY}` } },
    );
    return response.data;
  }

  async createQuote(amount: number, currency: string) {
    const response = await axios.post(
      `${this.API_URL}/quotes`,
      {
        profile: 28083073, // Your Wise Profile ID
        source: currency,
        target: 'EUR',
        targetAmount: amount,
        rateType: 'FIXED',
      },
      { headers: { Authorization: `Bearer ${this.API_KEY}` } },
    );
    return response.data;
  }

  async createTransfer(recipientId: number, quoteId: number) {
    const response = await axios.post(
      `${this.API_URL}/transfers`,
      {
        targetAccount: recipientId,
        quote: quoteId,
        customerTransactionId: `donation-${Date.now()}`,
      },
      { headers: { Authorization: `Bearer ${this.API_KEY}` } },
    );
    return response.data;
  }

  async getProfiles() {
    const response = await axios.get(`${this.API_URL}/v2/profiles`, {
      headers: { Authorization: `Bearer ${this.API_KEY}` },
    });
    return response.data;
  }

  async getAccountInfo() {
    const response = await axios.get(
      `${this.API_URL}/v2/accounts?profileId=28083073`,
      {
        headers: { Authorization: `Bearer ${this.API_KEY}` },
      },
    );
    return response.data;
  }
}
