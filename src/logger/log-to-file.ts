import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

export const logToFile = async (entry) => {
  const formattedEntry = `${Intl.DateTimeFormat('en-us', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Los_Angeles',
  }).format(new Date())}\t${entry}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', '..', 'logs', 'loggerFile.log'),
      formattedEntry,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
