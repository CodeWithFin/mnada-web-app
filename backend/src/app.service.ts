import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'MNADA API',
      version: '1.0.0',
      environment: this.configService.get('app.environment'),
    };
  }

  getStatus(): object {
    return {
      service: 'MNADA API',
      version: '1.0.0',
      description: 'Kenyan Fashion Social-Commerce Platform API',
      environment: this.configService.get('app.environment'),
      port: this.configService.get('app.port'),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      features: [
        'Authentication & Authorization',
        'User Management',
        'Merchant KYC',
        'Product Catalog',
        'Social Feed (SnapFit)',
        'Marketplace (ThreadBoard)',
        'Museum Donations',
        'Credit System',
        'Payment Processing (M-Pesa + Stripe)',
        'Push Notifications',
        'Search & Recommendations',
      ],
    };
  }
}
