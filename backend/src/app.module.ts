import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { 
  databaseConfig, 
  supabaseConfig, 
  jwtConfig, 
  appConfig, 
  paymentConfig, 
  searchConfig, 
  storageConfig, 
  rateLimitConfig,
  notificationConfig 
} from './config';

import { SupabaseModule } from './supabase';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core modules (to be created)
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { MerchantsModule } from './merchants/merchants.module';
// import { ProductsModule } from './products/products.module';
// import { OutfitsModule } from './outfits/outfits.module';
// import { OrdersModule } from './orders/orders.module';
// import { DonationsModule } from './donations/donations.module';
// import { CreditsModule } from './credits/credits.module';
// import { PaymentsModule } from './payments/payments.module';
// import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        supabaseConfig,
        jwtConfig,
        appConfig,
        paymentConfig,
        searchConfig,
        storageConfig,
        rateLimitConfig,
        notificationConfig,
      ],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('rateLimit.windowMs') || 900000,
            limit: configService.get<number>('rateLimit.maxRequests') || 100,
          },
        ],
      }),
    }),

    // Supabase integration
    SupabaseModule,

    // Core application modules (uncomment as we create them)
    // AuthModule,
    // UsersModule,
    // MerchantsModule,
    // ProductsModule,
    // OutfitsModule,
    // OrdersModule,
    // DonationsModule,
    // CreditsModule,
    // PaymentsModule,
    // NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
