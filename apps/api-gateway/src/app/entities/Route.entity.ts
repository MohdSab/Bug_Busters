export class Route {
  key: string;

  ip: string;

  port: number;

  /** Prefix to all request to this service */
  prefix?: string;

  /** Endpoint to API Gateway to reach the service */
  endpoint: string;
}
