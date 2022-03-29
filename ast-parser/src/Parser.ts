import { Token, TokenType } from "./Tokenizer";

export enum NodeType {
  Program = "Program",
  FunctionDeclaration = "FunctionDeclaration",
  Identifier = "Identifier",
  BlockStatement = "BlockStatement",
  ExpressionStatement = "ExpressionStatement",
  ReturnStatement = "ReturnStatement",
  CallExpression = "CallExpression",
  MemberExpression = "MemberExpression",
}

export enum FunctionType {
  FunctionDeclaration,
  CallExpression,
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

export interface CallExpression {
  type: NodeType.CallExpression;
  callee: Expression;
  arguments: Expression[];
}

export interface MemberExpression {
  type: NodeType.MemberExpression;
  object: Identifier | MemberExpression;
  property: Identifier;
  computed: boolean;
}

export interface BlockStatement {
  type: NodeType.BlockStatement;
  body: Statement[];
}

export interface ExpressionStatement {
  type: NodeType.ExpressionStatement;
  expression: CallExpression | MemberExpression | Identifier;
}

export interface FunctionDeclaration extends FunctionNode {
  type: NodeType.FunctionDeclaration;
  id: Identifier;
}

interface FunctionNode extends Node {
  id: Identifier | null;
  params: Expression[] | Identifier[];
  body: BlockStatement;
}

interface ReturnStatement {
  type: NodeType.ReturnStatement;
  argument: Expression;
}

type Statement =
  | FunctionDeclaration
  | ExpressionStatement
  | BlockStatement
  | ReturnStatement;

type Expression = CallExpression | MemberExpression | Identifier;

export class Parser {
  private _token: Token[] = [];
  private _currentIndex = 0;
  constructor(token: Token[]) {
    this._token = [...token];
  }

  parse(): Program {
    const program = this._parseProgram();
    return program;
  }

  private _parseProgram(): Program {
    const program: Program = {
      type: NodeType.Program,
      body: [],
    };
    while (!this._isEnd()) {
      const node = this._parseStatement();
      program.body.push(node);
    }
    return program;
  }

  private _parseStatement(): Statement {
    if (this._checkCurrentTokenType(TokenType.Function)) {
      return this._parseFunctionStatement();
    } else if (this._checkCurrentTokenType(TokenType.Identifier)) {
      return this._parseExpressionStatement();
    } else if (this._checkCurrentTokenType(TokenType.LeftCurly)) {
      return this._parseBlockStatement();
    } else if (this._checkCurrentTokenType(TokenType.Return)) {
      return this._parseReturnStatement();
    } else if (this._checkCurrentTokenType(TokenType.Import)) {
      // return this._parseImportStatement();
    }
    throw new Error("Unexpected token");
  }

  // private _parseImportStatement(): ImportStatement {
  //   this._goNext(TokenType.Import);
  //   const id = this._parseIdentifier();
  //   const node: ImportStatement = {
  //     type: NodeType.ImportStatement,
  //     id,
  //   };
  //   return node;
  // }

  private _parseReturnStatement(): ReturnStatement {
    this._goNext(TokenType.Return);
    const argument = this._parseExpression();
    const node: ReturnStatement = {
      type: NodeType.ReturnStatement,
      argument,
    };
    return node;
  }

  private _parseExpressionStatement(): ExpressionStatement {
    const expressionStatement: ExpressionStatement = {
      type: NodeType.ExpressionStatement,
      expression: this._parseExpression(),
    };
    return expressionStatement;
  }

  // 需要考虑 a.b.c 嵌套结构
  private _parseExpression(): Expression {
    // 拿到标识符，如 a
    let expresion: Identifier | CallExpression | MemberExpression =
      this._parseIdentifier();
    while (!this._isEnd()) {
      if (this._checkCurrentTokenType(TokenType.LeftParen)) {
        expresion = this._parseCallExpression(expresion);
      } else if (this._checkCurrentTokenType(TokenType.Dot)) {
        // 继续解析，a.b
        expresion = this._parseMemberExpression(expresion as MemberExpression);
      } else {
        break;
      }
    }
    return expresion;
  }

  private _parseMemberExpression(
    object: Identifier | MemberExpression
  ): MemberExpression {
    this._goNext(TokenType.Dot);
    const property = this._parseIdentifier();
    const node: MemberExpression = {
      type: NodeType.MemberExpression,
      object,
      property,
      computed: false,
    };
    return node;
  }

  private _parseCallExpression(callee: Expression) {
    const args = this._parseParams(FunctionType.CallExpression) as Expression[];
    const node: CallExpression = {
      type: NodeType.CallExpression,
      callee,
      arguments: args,
    };
    return node;
  }

  private _parseFunctionStatement(): FunctionDeclaration {
    this._goNext(TokenType.Function);
    const id = this._parseIdentifier();
    const params = this._parseParams();
    const body = this._parseBlockStatement();
    const node: FunctionDeclaration = {
      type: NodeType.FunctionDeclaration,
      id,
      params,
      body,
    };
    return node;
  }

  private _parseParams(
    mode: FunctionType = FunctionType.FunctionDeclaration
  ): Identifier[] | Expression[] {
    this._goNext(TokenType.LeftParen);
    const params = [];
    while (!this._checkCurrentTokenType(TokenType.RightParen)) {
      let param =
        mode === FunctionType.FunctionDeclaration
          ? // 函数声明
            this._parseIdentifier()
          : // 函数调用
            this._parseExpression();
      params.push(param);
      if (!this._checkCurrentTokenType(TokenType.RightParen)) {
        this._goNext(TokenType.Comma);
      }
    }
    this._goNext(TokenType.RightParen);
    this._skipSemicolon();
    return params;
  }

  private _parseIdentifier(): Identifier {
    const identifier: Identifier = {
      type: NodeType.Identifier,
      name: this._getCurrentToken().value!,
    };
    this._goNext(TokenType.Identifier);
    return identifier;
  }

  private _parseBlockStatement(): BlockStatement {
    const blockStatement: BlockStatement = {
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

  private _isEnd(): boolean {
    return this._currentIndex >= this._token.length;
  }

  private _checkCurrentTokenType(type: TokenType): boolean {
    const currentToken = this._token[this._currentIndex];
    return currentToken.type === type;
  }

  private _skipSemicolon(): void {
    if (this._checkCurrentTokenType(TokenType.Semicolon)) {
      this._goNext(TokenType.Semicolon);
    }
  }

  private _goNext(type: TokenType): Token {
    const currentToken = this._token[this._currentIndex];
    // 断言当前 Token 的类型，如果不能匹配，则抛出错误
    if (currentToken.type !== type) {
      throw new Error(`Expect ${type}, but got ${currentToken.type}`);
    }
    this._currentIndex++;
    return currentToken;
  }

  _getCurrentToken(): Token {
    return this._token[this._currentIndex];
  }
}
