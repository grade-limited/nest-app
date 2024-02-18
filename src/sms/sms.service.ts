import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async checkBalance() {
    const res = await fetch(
      `${process.env.SMS_API_URL}/sms/smsConfiguration/smsClientBalance.jsp?client=${process.env.SMS_API_CLIENTID}`,
    );
    return res.json();
  }

  async sendSms(mobile: string, message: string) {
    const res = await fetch(
      `${process.env.SMS_API_URL}:${process.env.SMS_API_PORT}/sendtext?apikey=${process.env.SMS_API_KEY}&secretkey=${process.env.SMS_API_SECRET}&callerID=GradeLTD&toUser=${mobile}&messageContent=${message}`,
    );
    return res.json();
  }
}
