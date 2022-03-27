import { Token, TokenType } from "./Tokenizer";

export enum NodeType {
  Program = "Program",
  FunctionDeclaration = "FunctionDeclaration",
  Identifier = "Identifier",
  BlockStatement = "BlockStatement",
  ExpressionStatement = "ExpressionStatement",
  CallExpression = "CallExpression",
  MemberExpression = "MemberExpression",
}

export interface Program extends Node {
  type: NodeType.Program;
  body: Statement[];
}

export interface Node {
  type: string;
}

export interface Identifier extends Node {
  type: NodeType.Identifier;
  name: string;
}

interface Statement extends Node {}
interface Expression extends Node {}
interface Declaration extends Statement {}

export interface CallExpression extends Expression {
  type: NodeType.CallExpression;
  callee: Expression;
  arguments: Expression[];
}

export interface FunctionDeclaration extends Function, Declaration {
  type: NodeType.FunctionDeclaration;
  id: Identifier;
}

interface Function extends Node {
  id: Identifier | null;
  params: Expression[] | Identifier[];
  body: Statement[];
}

export class Parser {
  private _token: Token[] = [];
  private _currentIndex = 0;
  constructor(token: Token[]) {
    this._token = [...token];
  }

  parse() {
    const program = this._parseProgram();
    return program;
  }

  private _parseProgram() {
    const program = {
      type: NodeType.Program,
      body: [],
    };
    while (!this._isEnd()) {
      const node = this._parseStatement();
      program.body.push(node);
    }
    return program;
  }

  private _parseStatement() {
    if (this._checkCurrentTokenType(TokenType.Function)) {
      return this._parseFunctionStatement();
    } else if (this._checkCurrentTokenType(TokenType.Identifier)) {
      return this._parseExpressionStatement();
    } else if (this._checkCurrentTokenType(TokenType.LeftCurly)) {
      return this._parseBlockStatement();
    }
  }

  private _parseExpressionStatement() {
    const expressionStatement = {
      type: NodeType.ExpressionStatement,
      expression: this._parseExpression(),
    };
    return expressionStatement;
  }

  private _parseExpression() {
    let expresion = this._parseIdentifier();
    while (!this._isEnd()) {
      if (this._checkCurrentTokenType(TokenType.LeftParen)) {
        expresion = this._parseCallExpression(expresion);
      } else if (this._checkCurrentTokenType(TokenType.Dot)) {
        expresion = this._parseMemberExpression(expresion);
      } else {
        break;
      }
    }
  }

  private _parseCallExpression(callee: string) {
    const arguments = this._parseParams("call");
    const node = {
      type: NodeType.CallExpression,
      callee,
      arguments,
    };
    return node;
  }

  private _parseFunctionStatement() {
    this._goNext(TokenType.Function);
    const id = this._parseIdentifier();
    const params = this._parseParams();
    const body = this._parseBlockStatement();
    const node = {
      type: NodeType.FunctionDeclaration,
      id,
      params,
      body,
    };
    return node;
  }

  private _parseParams(mode: "declaration" | "call" = "declaration") {
    this._goNext(TokenType.LeftParen);
    const params = [];
    while (!this._checkCurrentTokenType(TokenType.RightParen)) {
      let param =
        mode === "declaration"
          ? // 函数声明
            this._parseIdentifier()
          : // 函数调用
            this._parseExpression();
      params.push(param);
      if (!this._checkCurrentTokenType(TokenType.RightParen)) {
        this._goNext(TokenType.Comma);
      }
    }
    return params;
  }

  private _parseIdentifier(): Identifier {
    const identifier = this._getCurrentToken().value;
    this._goNext(TokenType.Identifier);
    return identifier;
  }

  private _parseBlockStatement() {
    const blockStatement = {
      type: NodeType.BlockStatement,
      body: [],
    };
    this._goNext(TokenType.LeftCurly);
    while (!this._checkCurrentTokenType(TokenType.RightCurly)) {
      const node = this._parseStatement();
      blockStatement.body.push(node);
    }
    this._goNext(TokenType.RightCurly);
    return blockStatement;
  }

  private _isEnd() {
    return this._currentIndex >= this._token.length;
  }

  private _checkCurrentTokenType(type: TokenType) {
    const currentToken = this._token[this._currentIndex];
    return currentToken.type === type;
  }

  private _goNext(type: TokenType) {
    const currentToken = this._token[this._currentIndex];
    // 断言当前 Token 的类型，如果不能匹配，则抛出错误
    if (currentToken.type !== type) {
      throw new Error(`Expect ${type}, but got ${currentToken.type}`);
    }
    this._currentIndex++;
    return currentToken;
  }

  _getCurrentToken() {
    return this._token[this._currentIndex];
  }
}
