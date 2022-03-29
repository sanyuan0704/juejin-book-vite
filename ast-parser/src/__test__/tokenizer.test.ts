import { describe, test, expect } from "vitest";
import { Tokenizer, TokenType } from "../Tokenizer";

describe("testTokenizerFunction", () => {
  test("test express", () => {
    const input = "1 + 2; 3 * 4";
    const expected = [
      { type: TokenType.Number, value: "1" },
      { type: TokenType.Operator, value: "+" },
      { type: TokenType.Number, value: "2" },
      { type: TokenType.Semicolon, value: ";" },
      { type: TokenType.Number, value: "3" },
      { type: TokenType.Operator, value: "*" },
      { type: TokenType.Number, value: "4" },
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
      { type: TokenType.Operator, value: "+" },
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

  test("test naemd import", () => {
    const input = 'import { foo } from "bar"';
    const expected = [
      { type: TokenType.Import, value: "import" },
      { type: TokenType.LeftCurly, value: "{" },
      { type: TokenType.Identifier, value: "foo" },
      { type: TokenType.RightCurly, value: "}" },
      { type: TokenType.From, value: "from" },
      { type: TokenType.StringLiteral, value: "bar" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test default import", () => {
    const input = 'import foo from "bar"';
    const expected = [
      { type: TokenType.Import, value: "import" },
      { type: TokenType.Identifier, value: "foo" },
      { type: TokenType.From, value: "from" },
      { type: TokenType.StringLiteral, value: "bar" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test namespace import", () => {
    const input = 'import * as foo from "bar"';
    const expected = [
      { type: TokenType.Import, value: "import" },
      { type: TokenType.Asterisk, value: "*" },
      { type: TokenType.As, value: "as" },
      { type: TokenType.Identifier, value: "foo" },
      { type: TokenType.From, value: "from" },
      { type: TokenType.StringLiteral, value: "bar" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test named export", () => {
    const input = "export { foo }";
    const expected = [
      { type: TokenType.Export, value: "export" },
      { type: TokenType.LeftCurly, value: "{" },
      { type: TokenType.Identifier, value: "foo" },
      { type: TokenType.RightCurly, value: "}" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test reexport", () => {
    const input = "export * from 'foo'; export { add } from 'bar';";
    const expected = [
      { type: TokenType.Export, value: "export" },
      { type: TokenType.Asterisk, value: "*" },
      { type: TokenType.From, value: "from" },
      { type: TokenType.StringLiteral, value: "foo" },
      { type: TokenType.Semicolon, value: ";" },
      { type: TokenType.Export, value: "export" },
      { type: TokenType.LeftCurly, value: "{" },
      { type: TokenType.Identifier, value: "add" },
      { type: TokenType.RightCurly, value: "}" },
      { type: TokenType.From, value: "from" },
      { type: TokenType.StringLiteral, value: "bar" },
      { type: TokenType.Semicolon, value: ";" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test export default", () => {
    const input = `export default function foo() { };`;
    const expected = [
      { type: TokenType.Export, value: "export" },
      { type: TokenType.Default, value: "default" },
      { type: TokenType.Function, value: "function" },
      { type: TokenType.Identifier, value: "foo" },
      { type: TokenType.LeftParen, value: "(" },
      { type: TokenType.RightParen, value: ")" },
      { type: TokenType.LeftCurly, value: "{" },
      { type: TokenType.RightCurly, value: "}" },
      { type: TokenType.Semicolon, value: ";" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });

  test("test export const/let/var", () => {
    const input = `export const foo = 'bar'; export let bar = 'foo'; export var baz = 'baz';`;
    const expected = [
      { type: TokenType.Export, value: "export" },
      { type: TokenType.Const, value: "const" },
      { type: TokenType.Identifier, value: "foo" },
      { type: TokenType.Assign, value: "=" },
      { type: TokenType.StringLiteral, value: "bar" },
      { type: TokenType.Semicolon, value: ";" },
      { type: TokenType.Export, value: "export" },
      { type: TokenType.Let, value: "let" },
      { type: TokenType.Identifier, value: "bar" },
      { type: TokenType.Assign, value: "=" },
      { type: TokenType.StringLiteral, value: "foo" },
      { type: TokenType.Semicolon, value: ";" },
      { type: TokenType.Export, value: "export" },
      { type: TokenType.Var, value: "var" },
      { type: TokenType.Identifier, value: "baz" },
      { type: TokenType.Assign, value: "=" },
      { type: TokenType.StringLiteral, value: "baz" },
      { type: TokenType.Semicolon, value: ";" },
    ];
    const tokenizer = new Tokenizer(input);
    expect(tokenizer.tokenize()).toEqual(expected);
  });
});
