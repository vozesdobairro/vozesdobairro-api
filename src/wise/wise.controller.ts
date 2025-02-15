import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WiseService } from './wise.service';

@Controller('wise')
export class WiseController {
  constructor(private readonly wiseService: WiseService) {}

  /*@Post()
  create(@Body() createRecipientDto: CreateRecipientDto) {
    return this.wiseService.createRecipient();
  }*/

  @Post('/recipient')
  async createRecipient() {
    const transfer = await this.wiseService.createRecipient(); // Replace with your recipient ID
    return { message: 'Created', transfer };
  }

  @Post('/donate')
  async donate(@Body() body) {
    const { amount, currency } = body;
    const quote = await this.wiseService.createQuote(amount, currency);
    const transfer = await this.wiseService.createTransfer(269532593, quote.id); // Replace with your recipient ID
    return { message: 'Donation initiated', transfer };
  }

  @Get()
  findAll() {
    return this.wiseService.getProfiles();
  }

  @Get('account')
  listAccount() {
    return this.wiseService.getAccountInfo();
  }
}
