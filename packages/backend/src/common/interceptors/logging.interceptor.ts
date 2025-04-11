import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, body } = request;

    if (path === "/_health") {
      return next.handle();
    }

    this.logger.log({ method, path, body });
    const start = Date.now();
    return next.handle().pipe(
      tap((response) =>
        this.logger.log({
          method,
          path,
          response,
          responseTimeMs: Date.now() - start,
        }),
      ),
    );
  }
}
