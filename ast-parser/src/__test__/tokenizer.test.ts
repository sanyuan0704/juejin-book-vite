import { describe, test, expect } from "vitest";
import { Tokenizer, TokenType } from "../Tokenizer";

describe("testTokenizerFunction", () => {
  test("test expression", () => {
    const input = "1 + 2; 3 * 4";
    const expected = [
      { type: TokenType.Number, value: "1", start: 0, end: 1, raw: "1" },
      { type: TokenType.Operator, value: "+", start: 2, end: 3 },
      { type: TokenType.Number, value: "2", start: 4, end: 5, raw: "2" },
      { type: TokenType.Semicolon, value: ";", start: 5, end: 6 },
      { type: TokenType.Number, value: "3", start: 7, end: 8, raw: "3" },
      { type: TokenType.Operator, value: "*", start: 9, end: 10 },
      { type: TokenType.Number, value: "4", start: 11, end: 12, raw: "4" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test number", () => {
    let input = "123.45";
    let expected = [
      {
        type: TokenType.Number,
        value: "123.45",
        start: 0,
        end: 6,
        raw: "123.45",
      },
    ];
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
      { type: TokenType.Function, value: "function", start: 0, end: 8 },
      { type: TokenType.Identifier, value: "foo", start: 9, end: 12 },
      { type: TokenType.LeftParen, value: "(", start: 12, end: 13 },
      { type: TokenType.Identifier, value: "a", start: 13, end: 14 },
      { type: TokenType.Comma, value: ",", start: 14, end: 15 },
      { type: TokenType.Identifier, value: "b", start: 16, end: 17 },
      { type: TokenType.RightParen, value: ")", start: 17, end: 18 },
      { type: TokenType.LeftCurly, value: "{", start: 19, end: 20 },
      { type: TokenType.Return, value: "return", start: 21, end: 27 },
      { type: TokenType.Identifier, value: "a", start: 28, end: 29 },
      { type: TokenType.Operator, value: "+", start: 30, end: 31 },
      { type: TokenType.Identifier, value: "b", start: 32, end: 33 },
      { type: TokenType.Semicolon, value: ";", start: 33, end: 34 },
      { type: TokenType.RightCurly, value: "}", start: 35, end: 36 },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test console.log", () => {
    const input = 'console.log("hello world")';
    const expected = [
      { type: TokenType.Identifier, value: "console", start: 0, end: 7 },
      { type: TokenType.Dot, value: ".", start: 7, end: 8 },
      { type: TokenType.Identifier, value: "log", start: 8, end: 11 },
      { type: TokenType.LeftParen, value: "(", start: 11, end: 12 },
      {
        type: TokenType.StringLiteral,
        value: "hello world",
        start: 12,
        end: 25,
        raw: '"hello world"',
      },
      { type: TokenType.RightParen, value: ")", start: 25, end: 26 },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test member express", () => {
    const input = "foo.bar";
    const expected = [
      { type: TokenType.Identifier, value: "foo", start: 0, end: 3 },
      { type: TokenType.Dot, value: ".", start: 3, end: 4 },
      { type: TokenType.Identifier, value: "bar", start: 4, end: 7 },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test naemd import", () => {
    const input = 'import { foo } from "bar"';
    const expected = [
      { type: TokenType.Import, value: "import", start: 0, end: 6 },
      { type: TokenType.LeftCurly, value: "{", start: 7, end: 8 },
      { type: TokenType.Identifier, value: "foo", start: 9, end: 12 },
      { type: TokenType.RightCurly, value: "}", start: 13, end: 14 },
      { type: TokenType.From, value: "from", start: 15, end: 19 },
      {
        type: TokenType.StringLiteral,
        value: "bar",
        start: 20,
        end: 25,
        raw: '"bar"',
      },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test default import", () => {
    const input = 'import foo from "bar"';
    const expected = [
      { type: TokenType.Import, value: "import", start: 0, end: 6 },
      { type: TokenType.Identifier, value: "foo", start: 7, end: 10 },
      { type: TokenType.From, value: "from", start: 11, end: 15 },
      {
        type: TokenType.StringLiteral,
        value: "bar",
        start: 16,
        end: 21,
        raw: '"bar"',
      },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test namespace import", () => {
    const input = 'import * as foo from "bar"';
    const expected = [
      { type: TokenType.Import, value: "import", start: 0, end: 6 },
      { type: TokenType.Asterisk, value: "*", start: 7, end: 8 },
      { type: TokenType.As, value: "as", start: 9, end: 11 },
      { type: TokenType.Identifier, value: "foo", start: 12, end: 15 },
      { type: TokenType.From, value: "from", start: 16, end: 20 },
      {
        type: TokenType.StringLiteral,
        value: "bar",
        start: 21,
        end: 26,
        raw: '"bar"',
      },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test named export", () => {
    const input = "export { foo }";
    const expected = [
      { type: TokenType.Export, value: "export", start: 0, end: 6 },
      { type: TokenType.LeftCurly, value: "{", start: 7, end: 8 },
      { type: TokenType.Identifier, value: "foo", start: 9, end: 12 },
      { type: TokenType.RightCurly, value: "}", start: 13, end: 14 },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test reexport", () => {
    const input = "export * from 'foo'; export { add } from 'bar';";
    const expected = [
      { type: TokenType.Export, value: "export", start: 0, end: 6 },
      { type: TokenType.Asterisk, value: "*", start: 7, end: 8 },
      { type: TokenType.From, value: "from", start: 9, end: 13 },
      {
        type: TokenType.StringLiteral,
        value: "foo",
        start: 14,
        end: 19,
        raw: "'foo'",
      },
      { type: TokenType.Semicolon, value: ";", start: 19, end: 20 },
      { type: TokenType.Export, value: "export", start: 21, end: 27 },
      { type: TokenType.LeftCurly, value: "{", start: 28, end: 29 },
      { type: TokenType.Identifier, value: "add", start: 30, end: 33 },
      { type: TokenType.RightCurly, value: "}", start: 34, end: 35 },
      { type: TokenType.From, value: "from", start: 36, end: 40 },
      {
        type: TokenType.StringLiteral,
        value: "bar",
        start: 41,
        end: 46,
        raw: "'bar'",
      },
      { type: TokenType.Semicolon, value: ";", start: 46, end: 47 },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test export default", () => {
    const input = `export default function foo() { };`;
    const expected = [
      { type: TokenType.Export, value: "export", start: 0, end: 6 },
      { type: TokenType.Default, value: "default", start: 7, end: 14 },
      { type: TokenType.Function, value: "function", start: 15, end: 23 },
      { type: TokenType.Identifier, value: "foo", start: 24, end: 27 },
      { type: TokenType.LeftParen, value: "(", start: 27, end: 28 },
      { type: TokenType.RightParen, value: ")", start: 28, end: 29 },
      { type: TokenType.LeftCurly, value: "{", start: 30, end: 31 },
      { type: TokenType.RightCurly, value: "}", start: 32, end: 33 },
      { type: TokenType.Semicolon, value: ";", start: 33, end: 34 },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test export const/let/var", () => {
    const input = `export const foo = 'bar'; export let bar = 'foo'; export var baz = 'baz';`;
    const expected = [
      { type: TokenType.Export, value: "export", start: 0, end: 6 },
      { type: TokenType.Const, value: "const", start: 7, end: 12 },
      { type: TokenType.Identifier, value: "foo", start: 13, end: 16 },
      { type: TokenType.Assign, value: "=", start: 17, end: 18 },
      {
        type: TokenType.StringLiteral,
        value: "bar",
        start: 19,
        end: 24,
        raw: "'bar'",
      },
      { type: TokenType.Semicolon, value: ";", start: 24, end: 25 },
      { type: TokenType.Export, value: "export", start: 26, end: 32 },
      { type: TokenType.Let, value: "let", start: 33, end: 36 },
      { type: TokenType.Identifier, value: "bar", start: 37, end: 40 },
      { type: TokenType.Assign, value: "=", start: 41, end: 42 },
      {
        type: TokenType.StringLiteral,
        value: "foo",
        start: 43,
        end: 48,
        raw: "'foo'",
      },
      { type: TokenType.Semicolon, value: ";", start: 48, end: 49 },
      { type: TokenType.Export, value: "export", start: 50, end: 56 },
      { type: TokenType.Var, value: "var", start: 57, end: 60 },
      { type: TokenType.Identifier, value: "baz", start: 61, end: 64 },
      { type: TokenType.Assign, value: "=", start: 65, end: 66 },
      {
        type: TokenType.StringLiteral,
        value: "baz",
        start: 67,
        end: 72,
        raw: "'baz'",
      },
      { type: TokenType.Semicolon, value: ";", start: 72, end: 73 },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });
});
