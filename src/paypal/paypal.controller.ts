import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { UpdatePaypalDto } from './dto/update-paypal.dto';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-payment')
  async createPayment(@Body() body, @Res() res) {
    const { amount, currency } = body;
    try {
      const payment = await this.paypalService.createPayment(
        amount,
        currency,
        'http://localhost:3000/paypal/success',
        'http://localhost:3000/paypal/cancel',
      );
      const approvalUrl = payment.links.find(
        (link) => link.rel === 'approval_url',
      ).href;
      return res.json({ approvalUrl });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @Get('success')
  async executePayment(
    @Query('paymentId') paymentId,
    @Query('PayerID') payerId,
    @Res() res,
  ) {
    try {
      const payment = await this.paypalService.executePayment(
        paymentId,
        payerId,
      );
      return res.json({ message: 'Payment successful', payment });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @Get('cancel')
  cancelPayment(@Res() res) {
    return res.json({ message: 'Payment cancelled' });
  }

  @Get()
  findAll() {
    return this.paypalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paypalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaypalDto: UpdatePaypalDto) {
    return this.paypalService.update(+id, updatePaypalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paypalService.remove(+id);
  }
}
