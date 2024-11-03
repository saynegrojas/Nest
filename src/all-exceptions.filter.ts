import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from './logger/logger.service';

type ResponseType = {
  message: string;
  error: string;
  statusCode: number;
};

type ResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | ResponseType;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObj: ResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      responseObj.statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      responseObj.response =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as ResponseType);
    } else {
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObj.response = 'Internal Server Error';
    }

    response.status(responseObj.statusCode).json(responseObj);

    if (typeof responseObj.response === 'object') {
      this.logger.error(responseObj.response.message, AllExceptionsFilter.name);
    } else {
      this.logger.error(responseObj.response, AllExceptionsFilter.name);
    }

    super.catch(exception, host);
  }
}
