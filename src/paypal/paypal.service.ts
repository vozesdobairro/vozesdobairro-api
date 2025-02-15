import { Injectable } from '@nestjs/common';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { UpdatePaypalDto } from './dto/update-paypal.dto';
import * as paypal from 'paypal-rest-sdk';

@Injectable()
export class PaypalService {
  constructor() {
    paypal.configure({
      mode: 'live', // Change to 'live' for production
      client_id:
        'AWvyee9KFy2gf14evI_J3LHAf7-g0wKx07BSbCZROsw2uK7wu7U2zU1XQIwgVzM6_T6nkwefjfzKzgOo',
      client_secret:
        'EBJOFLCMSI4LPbVhyr3IGgIB1YB7Cxry0K84zPgVKUYzW4bI5mBuEn1BxZsuKA_bx2v9AbDqmY1ou6Oo',
    });
  }

  createPayment(
    amount: number,
    currency: string,
    returnUrl: string,
    cancelUrl: string,
  ): Promise<any> {
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      transactions: [
        {
          amount: {
            total: amount.toFixed(2),
            currency: currency,
          },
          description: 'Payment for order',
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  }

  executePayment(paymentId: string, payerId: string): Promise<any> {
    const execute_payment_json = { payer_id: payerId };

    return new Promise((resolve, reject) => {
      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        (error, payment) => {
          if (error) {
            reject(error);
          } else {
            resolve(payment);
          }
        },
      );
    });
  }

  findAll() {
    return `This action returns all paypal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paypal`;
  }

  update(id: number, updatePaypalDto: UpdatePaypalDto) {
    return `This action updates a #${id} paypal`;
  }

  remove(id: number) {
    return `This action removes a #${id} paypal`;
  }
}
