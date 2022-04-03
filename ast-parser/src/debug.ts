// import { Tokenizer, TokenType } from "./Tokenizer";

// const input = "function foo(a, b) { return a + b; }";
// const expected = [
//   { type: TokenType.Function, value: "function" },
//   { type: TokenType.Identifier, value: "foo" },
//   { type: TokenType.LeftParen, value: "(" },
//   { type: TokenType.Identifier, value: "a" },
//   { type: TokenType.Comma, value: "," },
//   { type: TokenType.Identifier, value: "b" },
//   { type: TokenType.RightParen, value: ")" },
//   { type: TokenType.LeftCurly, value: "{" },
//   { type: TokenType.Return, value: "return" },
//   { type: TokenType.Identifier, value: "a" },
//   { type: TokenType.OPERATOR, value: "+" },
//   { type: TokenType.Identifier, value: "b" },
//   { type: TokenType.Semicolon, value: ";" },
//   { type: TokenType.RightCurly, value: "}" },
// ];
// const tokenizer = new Tokenizer(input);
// console.log(tokenizer.tokenize());

import { Tokenizer } from "./Tokenizer";
import { Parser } from "./Parser";
const input = "let a = 1;";
const tokenizer = new Tokenizer(input);
const tokens = tokenizer.tokenize();
const parser = new Parser(tokens);
parser.parse();
