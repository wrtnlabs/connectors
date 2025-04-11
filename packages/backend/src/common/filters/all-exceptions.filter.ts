import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ErrorUtil } from "../../utils/ErrorUtil";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    let statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const customCode = statusCode;
    statusCode =
      statusCode > 599 ? +statusCode.toString().slice(0, 3) : statusCode;

    if (statusCode >= 500 && statusCode < 600) {
      this.logger.error(exception, exception.stack);
    } else {
      this.logger.log(JSON.stringify(exception));
    }

    const message = ErrorUtil.toJSON(exception);
    res.status(statusCode).json({
      statusCode: customCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      arguments: req.body,
      message: "response" in message ? message.response : message,
    });
  }
}
