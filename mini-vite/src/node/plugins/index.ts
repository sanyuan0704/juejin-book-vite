import { cssPlugin } from "./css";
import { esbuildTransformPlugin } from "./esbuild";
import { resolvePlugin } from "./resolve";
import { importAnalysisPlugin } from "./importAnalysis";
import { Plugin } from "../plugin";
import { clientInjectPlugin } from "./clientInject";
import { assetPlugin } from "./assets";

export function resolvePlugins(): Plugin[] {
  return [
    resolvePlugin(),
    cssPlugin(),
    assetPlugin(),
    esbuildTransformPlugin(),
    importAnalysisPlugin(),
    clientInjectPlugin(),
  ];
}
