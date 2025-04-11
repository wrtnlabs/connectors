import core from "@nestia/core";
import { Controller } from "@nestjs/common";

/**
 * Health check controller
 */
@Controller()
export class HealthCheckController {
  /**
   * health check port
   *
   * @internal
   */
  @core.TypedRoute.Get("/_health")
  public ping(): boolean {
    return true;
  }
}
