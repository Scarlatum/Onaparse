import { utils } from './utils'

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

const LITERALS: Record<tags, string> = {
  [tags.paragraph]  : '',
  [tags.separator]  : '-',
  [tags.image]      : '!',
  [tags.quote]      : '>',
  [tags.code]       : '`',
  [tags.h1]         : '#',
  [tags.h2]         : '##',
  [tags.h3]         : '###',
  [tags.h4]         : '####',
  [tags.h5]         : '#####',
}

const LITERAL_INVERSE = Object.fromEntries(Object.entries(LITERALS).map(utils.swap));

type StructNode = {
  type  : tags,
  value : unknown,
};

export default class Onaparse {

  private codeBuffer: Array<string> = Array();

  private processHeading(line: string): StructNode {

    const literal = line.split(" ")[0];

    return {
      type: LITERAL_INVERSE[literal] as tags,
      value: line.slice(literal.length).trim()
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
      type: tags.image,
      value: {
        url   : URL,
        title : TITLE,
      }  
    }

  }

  private processCode(line: Array<string>): StructNode {

    const lang = line.shift()!.replaceAll(LITERALS.code, String()).trim();

    line.pop();

    return {
      type: tags.code,
      value: {
        lang: lang,
        data: line.reduce((acc, cur) => `${ acc }\r\n${ cur }`, String())
      }
    }

  }

  private processPrimitives(line: string, char: string): StructNode {

    switch (char) {

      case LITERALS.hr:
        return { type: tags.separator, value: null };    

      case LITERALS.blackquote:
        return { type: tags.quote, value: line.substring(2) };

      default:
        return { type: tags.paragraph, value: line }

    }

  }

  public parse(data: string): Array<StructNode> {

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

          if ( Boolean(line.charAt(2) === LITERALS.code ) ) buffer = !buffer;

          this.codeBuffer.push(line)

          if ( !buffer ) result.push(this.processCode(this.codeBuffer))

        } break;

        default: 
          result.push(this.processPrimitives(line, char)); break;

      }

    })

    return result;

  }

}