import fs from 'node:fs'
import ts from 'typescript'

type JsxNamedNode =
  | ts.JsxElement
  | ts.JsxSelfClosingElement
  | ts.JsxOpeningElement

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim()

const getTagName = (node: ts.JsxElement | ts.JsxSelfClosingElement | ts.JsxOpeningElement): string => {
  if (ts.isJsxElement(node)) {
    return node.openingElement.tagName.getText()
  }

  return node.tagName.getText()
}

const getJsxAttributes = (
  node: ts.JsxElement | ts.JsxSelfClosingElement | ts.JsxOpeningElement,
): ts.JsxAttributes => {
  if (ts.isJsxElement(node)) {
    return node.openingElement.attributes
  }

  return node.attributes
}

const textFromJsxChild = (child: ts.JsxChild): string => {
  if (ts.isJsxText(child)) {
    return child.getText()
  }

  if (ts.isJsxExpression(child)) {
    if (!child.expression) {
      return ''
    }

    if (
      ts.isStringLiteral(child.expression) ||
      ts.isNoSubstitutionTemplateLiteral(child.expression)
    ) {
      return child.expression.text
    }

    return ''
  }

  if (ts.isJsxElement(child)) {
    return child.children.map(textFromJsxChild).join(' ')
  }

  if (ts.isJsxFragment(child)) {
    return child.children.map(textFromJsxChild).join(' ')
  }

  return ''
}

export const parseTsxFile = (filePath: string): ts.SourceFile => {
  const sourceText = fs.readFileSync(filePath, 'utf8')

  return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}

export const findJsxElementsByName = (sourceFile: ts.SourceFile, tagName: string): ts.JsxElement[] => {
  const results: ts.JsxElement[] = []

  const visit = (node: ts.Node): void => {
    if (ts.isJsxElement(node) && getTagName(node) === tagName) {
      results.push(node)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return results
}

export const findJsxSelfClosingElementsByName = (
  sourceFile: ts.SourceFile,
  tagName: string,
): ts.JsxSelfClosingElement[] => {
  const results: ts.JsxSelfClosingElement[] = []

  const visit = (node: ts.Node): void => {
    if (ts.isJsxSelfClosingElement(node) && getTagName(node) === tagName) {
      results.push(node)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return results
}

export const findJsxNodesByName = (
  sourceFile: ts.SourceFile,
  tagName: string,
): Array<ts.JsxElement | ts.JsxSelfClosingElement> => {
  const results: Array<ts.JsxElement | ts.JsxSelfClosingElement> = []

  const visit = (node: ts.Node): void => {
    if (ts.isJsxElement(node) && getTagName(node) === tagName) {
      results.push(node)
    }

    if (ts.isJsxSelfClosingElement(node) && getTagName(node) === tagName) {
      results.push(node)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return results
}

export const getJsxAttributeStringValue = (
  node: ts.JsxElement | ts.JsxSelfClosingElement | ts.JsxOpeningElement,
  attributeName: string,
): string | null => {
  const attributes = getJsxAttributes(node)

  for (const property of attributes.properties) {
    if (!ts.isJsxAttribute(property) || property.name.getText() !== attributeName) {
      continue
    }

    if (!property.initializer) {
      return null
    }

    if (ts.isStringLiteral(property.initializer)) {
      return normalizeWhitespace(property.initializer.text)
    }

    if (ts.isJsxExpression(property.initializer) && property.initializer.expression) {
      const expression = property.initializer.expression

      if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
        return normalizeWhitespace(expression.text)
      }
    }
  }

  return null
}

export const collectTextsByTagName = (sourceFile: ts.SourceFile, tagName: string): string[] =>
  findJsxElementsByName(sourceFile, tagName)
    .map((element) => normalizeWhitespace(element.children.map(textFromJsxChild).join(' ')))
    .filter(Boolean)

export const findExportedObjectLiteral = (
  sourceFile: ts.SourceFile,
  variableName: string,
): ts.ObjectLiteralExpression | null => {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue
    }

    const isExported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    if (!isExported) {
      continue
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === variableName &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        return declaration.initializer
      }
    }
  }

  return null
}

export const getObjectLiteralStringProperty = (
  objectLiteral: ts.ObjectLiteralExpression,
  propertyName: string,
): string | null => {
  for (const property of objectLiteral.properties) {
    if (
      !ts.isPropertyAssignment(property) ||
      !ts.isIdentifier(property.name) ||
      property.name.text !== propertyName
    ) {
      continue
    }

    const initializer = property.initializer

    if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
      return normalizeWhitespace(initializer.text)
    }
  }

  return null
}

export const getNestedObjectLiteralStringProperty = (
  objectLiteral: ts.ObjectLiteralExpression,
  propertyPath: string[],
): string | null => {
  let current: ts.ObjectLiteralExpression | null = objectLiteral

  for (let index = 0; index < propertyPath.length; index += 1) {
    const segment = propertyPath[index]

    if (!current) {
      return null
    }

    let property: ts.PropertyAssignment | null = null

    for (const entry of current.properties) {
      if (
        ts.isPropertyAssignment(entry) &&
        ts.isIdentifier(entry.name) &&
        entry.name.text === segment
      ) {
        property = entry
        break
      }
    }

    if (!property) {
      return null
    }

    const initializer: ts.Expression = property.initializer

    if (index === propertyPath.length - 1) {
      if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
        return normalizeWhitespace(initializer.text)
      }

      return null
    }

    if (!ts.isObjectLiteralExpression(initializer)) {
      return null
    }

    current = initializer
  }

  return null
}
