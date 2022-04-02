import { resolve } from 'path';
import fs from 'fs';

import Lexer from './lexer';

const FILE_PATH = resolve(process.cwd(), 'src/posts/post.md');

const POST = fs.readFileSync(FILE_PATH).toString('utf-8');

const lexer = new Lexer();


console.time('Parse time');
const RESULT = lexer.processFile(POST);
console.timeEnd('Parse time');

fs.writeFileSync('post.json', JSON.stringify(RESULT));

console.log(RESULT)

