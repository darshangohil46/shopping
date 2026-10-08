import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export interface OrderEmailItem {
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const user =
      this.configService.get<string>('SMTP_USER') ||
      this.configService.get<string>('GMAIL_USER');
    const pass =
      this.configService.get<string>('SMTP_PASS') ||
      this.configService.get<string>('GMAIL_PASS');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    this.logger.log('Email transport configured with Gmail service');
  }

  async sendOrderSummary(
    toEmail: string,
    userName: string,
    items: OrderEmailItem[],
    grandTotal: number,
  ): Promise<{ success: boolean }> {
    try {
      if (!this.transporter) {
        this.initTransporter();
      }

      const templatePath = fs.existsSync(
        path.join(__dirname, '..', 'template', 'order-summary.html'),
      )
        ? path.join(__dirname, '..', 'template', 'order-summary.html')
        : path.join(
            __dirname,
            '..',
            '..',
            'src',
            'template',
            'order-summary.html',
          );

      const html = fs.readFileSync(templatePath, 'utf-8');

      const rows = items
        .map(
          (item) => `
          <tr>
            <td>${item.name}</td>
            <td class="text-right" style="text-align:right;">${item.quantity}</td>
            <td class="text-right" style="text-align:right;">Rs. ${Number(item.price).toLocaleString()}</td>
            <td class="text-right" style="text-align:right;">Rs. ${Number(item.lineTotal).toLocaleString()}</td>
          </tr>
        `,
        )
        .join('');

      const formattedHtml = html
        .replace(/{{userName}}/g, userName)
        .replace(/{{tableRows}}/g, rows)
        .replace(/{{grandTotal}}/g, Number(grandTotal).toLocaleString());

      const textSummary = [
        `Subject: Your order summary`,
        `Hi ${userName}, thanks for your order. Here is your bill:`,
        `Product Qty Price Total`,
        ...items.map(
          (i) =>
            `${i.name} ${i.quantity} Rs. ${Number(i.price).toLocaleString()} Rs. ${Number(i.lineTotal).toLocaleString()}`,
        ),
        `Grand total Rs. ${Number(grandTotal).toLocaleString()}`,
      ].join('\n');

      const fromAddress =
        this.configService.get<string>('SMTP_FROM') ||
        this.configService.get<string>('SMTP_USER') ||
        '<orders@onlinecart.local>';

      await this.transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: 'Your order summary',
        text: textSummary,
        html: formattedHtml,
      });

      this.logger.log(`Order summary email sent successfully to ${toEmail}`);
      return { success: true };
    } catch (error) {
      // As requested in the assessment: handle an email failure without crashing the app
      this.logger.error(
        `Failed to send order summary email to ${toEmail}:`,
        error,
      );
      return { success: false };
    }
  }
}
