const enum tags {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  paragraph = 'p',
  image = 'img',
  separator = 'hr',
  quote = 'blackquote',
  code = 'code',
}

enum LITERALS_REVERSE {
  '' = tags.paragraph,
  '#' = tags.h1,
  '##' = tags.h2,
  '###' = tags.h3,
  '####' = tags.h4,
  '#####' = tags.h5,
  '!' = tags.image,
  '>' = tags.quote,
  '-' = tags.separator,
  '`' = tags.code
}

const LITERALS: Record<tags, keyof typeof LITERALS_REVERSE> = {
  h1    : '#',
  h2    : '##',
  h3    : '###',
  h4    : '####',
  h5    : '#####',
  p     : '',
  img   : '!',
  hr    : '-',
  code  : '`',
  blackquote : '>',
}

type StructNode = Partial<Record<tags, unknown>>;

export default class Lexer {

  private codeBuffer: Array<string> = Array();

  private processHeading(line: string): StructNode {

    const header = line.split(" ")[0];

    return {
      [LITERALS_REVERSE[header as keyof typeof LITERALS_REVERSE]]: line.slice(header.length).trim()
    }

  }

  private processImage(line: string): StructNode {

    const regs = {
      title : new RegExp('\\[.+\\]'),
      url   : new RegExp('\\(.+\\)'),
    }

    const clean = (str: string): string => {
      return str.substring(1).slice(0, str.length - 2);
    }

    const URL   = clean(regs.url.exec(line)![0]);
    const TITLE = clean(regs.title.exec(line)![0]);

    return {
      [LITERALS_REVERSE[LITERALS.img]]: {
        url   : URL,
        title : TITLE,
      }  
    }

  }

  private processCode(line: Array<string>): StructNode {

    const lang = line.shift()!.replaceAll(LITERALS.code, String()).trim();

    line.pop();

    return {
      [LITERALS_REVERSE[LITERALS.code]]: {
        lang: lang,
        data: line.reduce((acc, cur) => `${ acc }\r\n${ cur }`, String())
      }
    }

  }

  public processFile(data: string): Array<StructNode> {

    let buffer: boolean = false;

    const lines = data.split('\r\n').filter(x => x.length)
    const result = Array<StructNode>();

    lines.forEach(line => {

      const char = buffer 
        ? LITERALS.code
        : line.charAt(0)

      switch (char) {
        case LITERALS.h1: 
          result.push(this.processHeading(line)); break;
        case LITERALS.img:
          result.push(this.processImage(line)); break;
        case LITERALS.code: {

          console.log('code case');

          if ( Boolean(line.charAt(2) === LITERALS.code ) ) buffer = !buffer;

          this.codeBuffer.push(line)

          if ( !buffer ) result.push(this.processCode(this.codeBuffer))

        } break;
        case LITERALS.hr:
          result.push({ [ tags.separator ]: null }); break;
        case LITERALS.blackquote:
          result.push({ [ tags.quote ]: line.substring(2).trim() }); break;
        default: 
          result.push({ [ tags.paragraph ]: line.trim() }); break;
      }

    })

    return result;

  }

}