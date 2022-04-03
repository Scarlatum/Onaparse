import { resolve } from 'path';
import { writeFileSync, readFileSync, mkdirSync, lstat } from 'fs';

import Onaparse from './main';

const Ona = new Onaparse();

const FILE_PATH: string = resolve(process.cwd(), 'posts/post.md');
const POST_DATA: string = readFileSync(FILE_PATH).toString('utf-8');

const ParsedData = Ona.parse(POST_DATA);

lstat('dist', (err) => {

  if ( err ) mkdirSync('dist');

  writeFileSync('dist/post.json', JSON.stringify(ParsedData));

});

