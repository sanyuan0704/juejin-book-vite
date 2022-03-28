import { isWhiteSpace, isAlpha, isDigit } from "./utils";

export enum TokenType {
  Function = "Function",
  Number = "Number",
  OPERATOR = "Operator",
  Identifier = "Identifier",
  LeftParen = "LeftParen",
  RightParen = "RightParen",
  LeftCurly = "LeftCurly",
  RightCurly = "RightCurly",
  Comma = "Comma",
  Dot = "Dot",
  Semicolon = "Semicolon",
  StringLiteral = "StringLiteral",
  Return = "Return",
}

export enum ScanMode {
  Normal,
  Identifier,
  StringLiteral,
  Number,
}

export type Token = {
  type: TokenType;
  value?: string;
};

// 策略模式
const INTERNAL_TOKENS_GENERATOR = {
  number(value?: string) {
    return { type: TokenType.Number, value };
  },
  function() {
    return {
      type: TokenType.Function,
      value: "function",
    };
  },
  return() {
    return {
      type: TokenType.Return,
      value: "return",
    };
  },
  operator(value?: string) {
    return {
      type: TokenType.OPERATOR,
      value,
    };
  },
  comma() {
    return {
      type: TokenType.Comma,
      value: ",",
    };
  },
  leftParen() {
    return { type: TokenType.LeftParen, value: "(" };
  },
  rightParen() {
    return { type: TokenType.RightParen, value: ")" };
  },
  leftCurly() {
    return { type: TokenType.LeftCurly, value: "{" };
  },
  rightCurly() {
    return { type: TokenType.RightCurly, value: "}" };
  },
  dot() {
    return { type: TokenType.Dot, value: "." };
  },
  semicolon() {
    return { type: TokenType.Semicolon, value: ";" };
  },
  stringLiteral(value?: string) {
    return {
      type: TokenType.StringLiteral,
      value,
    };
  },
};

type SingleCharTokens = "(" | ")" | "{" | "}" | "." | ";" | ",";

const KNOWN_SINGLE_CHAR_TOKENS = new Map<
  SingleCharTokens,
  typeof INTERNAL_TOKENS_GENERATOR[keyof typeof INTERNAL_TOKENS_GENERATOR]
>([
  ["(", INTERNAL_TOKENS_GENERATOR.leftParen],
  [")", INTERNAL_TOKENS_GENERATOR.rightParen],
  ["{", INTERNAL_TOKENS_GENERATOR.leftCurly],
  ["}", INTERNAL_TOKENS_GENERATOR.rightCurly],
  [".", INTERNAL_TOKENS_GENERATOR.dot],
  [";", INTERNAL_TOKENS_GENERATOR.semicolon],
  [",", INTERNAL_TOKENS_GENERATOR.comma],
]);

const QUOTATION_TOKENS = ["'", '"', "`"];

const OPERATOR_TOKENS = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "^",
  "&",
  "|",
  "~",
  "<<",
  ">>",
];

export class Tokenizer {
  private _tokens: Token[] = [];
  private _currentIndex: number = 0;
  private _source: string;
  private _scanMode = ScanMode.Normal;
  constructor(input: string) {
    this._source = input;
  }

  scanIndentifier(): void {
    this._setScanMode(ScanMode.Identifier);
    // 继续扫描，直到收集完整的单词
    let identifier = "";
    let currentChar = this._getCurrentChar();
    while (isAlpha(currentChar)) {
      identifier += currentChar;
      this._currentIndex++;
      currentChar = this._getCurrentChar();
    }
    // 1. 结果为关键字
    if (identifier in INTERNAL_TOKENS_GENERATOR) {
      const token =
        INTERNAL_TOKENS_GENERATOR[
          identifier as keyof typeof INTERNAL_TOKENS_GENERATOR
        ]();
      this._tokens.push(token);
    }
    // 2. 结果为标识符
    else {
      this._tokens.push({
        type: TokenType.Identifier,
        value: identifier,
      });
    }
    this._resetScanMode();
  }

  scanStringLiteral(): void {
    this._setScanMode(ScanMode.StringLiteral);
    let currentChar = this._getCurrentChar();
    // 记录引号
    const startQuotation = currentChar;
    // 继续找字符串
    this._currentIndex++;
    let str = "";
    currentChar = this._getCurrentChar();
    while (currentChar && currentChar !== startQuotation) {
      str += currentChar;
      this._currentIndex++;
      currentChar = this._getCurrentChar();
    }
    this._tokens.push(INTERNAL_TOKENS_GENERATOR.stringLiteral(str));
    this._resetScanMode();
  }

  _scanNumber(): void {
    this._setScanMode(ScanMode.Number);
    let number = "";
    let currentChar = this._getCurrentChar();
    let isFloat = false;
    // 如果是数字，则继续扫描
    // 需要考虑到小数点
    while (isDigit(currentChar) || (currentChar === "." && !isFloat)) {
      if (currentChar === ".") {
        isFloat = true;
      }
      number += currentChar;
      this._currentIndex++;
      currentChar = this._getCurrentChar();
    }
    if (isFloat && currentChar === ".") {
      throw new Error('Unexpected character "."');
    }
    this._tokens.push(INTERNAL_TOKENS_GENERATOR.number(number));
    this._resetScanMode();
  }

  tokenize(): Token[] {
    // 扫描
    while (this._currentIndex < this._source.length) {
      debugger;
      let currentChar = this._source[this._currentIndex];
      // 1. 判断是否是分隔符
      if (isWhiteSpace(currentChar)) {
        this._currentIndex++;
        continue;
      }
      // 2. 判断是否是字母
      else if (isAlpha(currentChar)) {
        this.scanIndentifier();
        continue;
      }
      // 3. 判断是否是单字符 () {} . ;
      else if (KNOWN_SINGLE_CHAR_TOKENS.has(currentChar as SingleCharTokens)) {
        const token = KNOWN_SINGLE_CHAR_TOKENS.get(
          currentChar as SingleCharTokens
        )!();
        this._tokens.push(token);
        this._currentIndex++;
      }
      // 4. 判断是否为引号
      else if (QUOTATION_TOKENS.includes(currentChar)) {
        this.scanStringLiteral();
        // 跳过结尾的引号
        this._currentIndex++;
        continue;
      }
      // 5. 判断二元计算符
      else if (
        (OPERATOR_TOKENS.includes(currentChar) ||
          OPERATOR_TOKENS.includes(currentChar + this._getNextChar())) &&
        this._scanMode === ScanMode.Normal
      ) {
        this._tokens.push(INTERNAL_TOKENS_GENERATOR.operator(currentChar));
        this._currentIndex++;
        continue;
      }
      // 6. 判断数字
      else if (isDigit(currentChar)) {
        this._scanNumber();
        continue;
      }
    }
    this._resetCurrentIndex();
    return this._getTokens();
  }

  private _getCurrentChar() {
    return this._source[this._currentIndex];
  }

  private _getNextChar() {
    if (this._currentIndex + 1 < this._source.length) {
      return this._source[this._currentIndex + 1];
    }
    return "";
  }

  private _resetCurrentIndex() {
    this._currentIndex = 0;
  }

  private _getTokens() {
    return this._tokens;
  }

  private _setScanMode(mode: ScanMode) {
    this._scanMode = mode;
  }

  private _resetScanMode() {
    this._scanMode = ScanMode.Normal;
  }
}
