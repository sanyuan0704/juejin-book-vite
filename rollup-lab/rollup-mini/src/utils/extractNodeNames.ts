// const extractors = {
//   Identifier(names: string[], node: any) {
//     names.push(node.name);
//   },

//   ObjectPattern(names: string[], node: any) {
//     node.properties.forEach((prop: any) => {
//       extractors[prop.key.type](names, prop.key);
//     });
//   },

//   ArrayPattern(names, node) {
//     node.elements.forEach((element) => {
//       if (element) extractors[element.type](names, element);
//     });
//   },

//   RestElement(names, node) {
//     extractors[node.argument.type](names, node.argument);
//   },

//   AssignmentPattern(names, node) {
//     return extractors[node.left.type](names, node.left);
//   }
// };

// export function extractNodeNames(node: any) {
//   let names: string[] = [];
//   extractors(node.type)(names, node);
//   return names;
// }
