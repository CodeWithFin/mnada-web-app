import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  getHealth(): object {
    return this.appService.getHealth();
  }

  @Get('status')
  @ApiOperation({ summary: 'API status and version' })
  @ApiResponse({ status: 200, description: 'API status information' })
  getStatus(): object {
    return this.appService.getStatus();
  }
}
