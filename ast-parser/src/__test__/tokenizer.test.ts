import { describe, test, expect } from "vitest";
import { Tokenizer, TokenType } from "../Tokenizer";

describe("testTokenizerFunction", () => {
  test("test express", () => {
    const input = "1 + 2";
    const expected = [
      { type: TokenType.Number, value: "1" },
      { type: TokenType.OPERATOR, value: "+" },
      { type: TokenType.Number, value: "2" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test number", () => {
    let input = "123.45";
    let expected = [{ type: TokenType.Number, value: "123.45" }];
    let tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);

    input = "123.45.6";
    tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize.bind(tokenizer)).toThrowError(
      'Unexpected character "."'
    );
  });

  test("testing function", () => {
    const input = "function foo(a, b) { return a + b; }";
    const expected = [
      { type: TokenType.Function, value: "function" },
      { type: TokenType.Identifier, value: "foo" },
      { type: TokenType.LeftParen, value: "(" },
      { type: TokenType.Identifier, value: "a" },
      { type: TokenType.Comma, value: "," },
      { type: TokenType.Identifier, value: "b" },
      { type: TokenType.RightParen, value: ")" },
      { type: TokenType.LeftCurly, value: "{" },
      { type: TokenType.Return, value: "return" },
      { type: TokenType.Identifier, value: "a" },
      { type: TokenType.OPERATOR, value: "+" },
      { type: TokenType.Identifier, value: "b" },
      { type: TokenType.Semicolon, value: ";" },
      { type: TokenType.RightCurly, value: "}" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test console.log", () => {
    const input = 'console.log("hello world")';
    const expected = [
      { type: TokenType.Identifier, value: "console" },
      { type: TokenType.Dot, value: "." },
      { type: TokenType.Identifier, value: "log" },
      { type: TokenType.LeftParen, value: "(" },
      { type: TokenType.StringLiteral, value: "hello world" },
      { type: TokenType.RightParen, value: ")" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test member express", () => {
    const input = "foo.bar";
    const expected = [
      { type: TokenType.Identifier, value: "foo" },
      { type: TokenType.Dot, value: "." },
      { type: TokenType.Identifier, value: "bar" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });
});
