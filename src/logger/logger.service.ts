import { ConsoleLogger, Injectable } from '@nestjs/common';
import { logToFile } from './log-to-file';

@Injectable()
export class LoggerService extends ConsoleLogger {
  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;
    logToFile(entry);
    super.error(message, stackOrContext);
  }
}
