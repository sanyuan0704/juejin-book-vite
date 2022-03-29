import { describe, test, expect } from "vitest";
import { Parser, MemberExpression, NodeType, Program } from "../Parser";
import { Tokenizer } from "../Tokenizer";

describe("testParserFunction", () => {
  test("test member expression", () => {
    const input = "foo.bar";
    const memberExpression: MemberExpression = {
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
    const program: Program = {
      type: NodeType.Program,
      body: [
        {
          type: NodeType.ExpressionStatement,
          expression: memberExpression,
        },
      ],
    };
    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    expect(parser.parse()).toEqual(program);
  });

  test("test nested member expression", () => {
    const input = "foo.bar.zoo";
    const memberExpression: MemberExpression = {
      type: NodeType.MemberExpression,
      object: {
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
      },
      property: {
        type: NodeType.Identifier,
        name: "zoo",
      },
      computed: false,
    };
    const program: Program = {
      type: NodeType.Program,
      body: [
        {
          type: NodeType.ExpressionStatement,
          expression: memberExpression,
        },
      ],
    };
    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    expect(parser.parse()).toEqual(program);
  });

  test("test function", () => {
    const input = "function foo(a, b) { return a.add(b); }";
    const functionDeclaration: Program = {
      type: NodeType.Program,
      body: [
        {
          type: NodeType.FunctionDeclaration,
          id: {
            type: NodeType.Identifier,
            name: "foo",
          },
          params: [
            {
              type: NodeType.Identifier,
              name: "a",
            },
            {
              type: NodeType.Identifier,
              name: "b",
            },
          ],
          body: {
            type: NodeType.BlockStatement,
            body: [
              {
                type: NodeType.ReturnStatement,
                argument: {
                  type: NodeType.CallExpression,
                  callee: {
                    type: NodeType.MemberExpression,
                    object: {
                      type: NodeType.Identifier,
                      name: "a",
                    },
                    property: {
                      type: NodeType.Identifier,
                      name: "add",
                    },
                    computed: false,
                  },
                  arguments: [
                    {
                      type: NodeType.Identifier,
                      name: "b",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    expect(parser.parse()).toEqual(functionDeclaration);
  });
});
