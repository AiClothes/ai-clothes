import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 确定状态码
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 确定响应体
    const responseBody = {
      status_code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error_info:
        exception instanceof HttpException
          ? exception.getResponse()
          : { message: 'Internal server error' }
    };

    // 发送响应
    response.status(status).json(responseBody);
  }
}
