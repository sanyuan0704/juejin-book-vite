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

import { Parser, MemberExpression, NodeType } from "./Parser";
import { Tokenizer } from "./Tokenizer";
const input = "foo.bar";
const expected: MemberExpression = {
  type: NodeType.MemberExpression,
  object: {
    type: NodeType.Identifier,
    name: "foo",
  },
  property: {
    type: NodeType.Identifier,
    name: "bar",
  },
  computed: false,
};
const tokenizer = new Tokenizer(input);
const tokens = tokenizer.tokenize();
const parser = new Parser(tokens);
console.log(JSON.stringify(parser.parse(), null, 2));
