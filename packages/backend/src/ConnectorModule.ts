import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { pinoLoggerParams } from "./common/logger/logger";
import { HealthCheckController } from "./controllers/HealthCheckController";

@Module({
  imports: [LoggerModule.forRoot({ ...pinoLoggerParams })],
  controllers: [HealthCheckController],
})
export class ConnectorModule {}
