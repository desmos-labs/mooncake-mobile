import { dangerReassure } from 'reassure';
import path from 'path';

dangerReassure({
  inputFilePath: path.join(__dirname, '.reassure/output.md'),
});
