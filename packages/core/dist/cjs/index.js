"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.WebAIRewriter = exports.WebAIWriter = exports.WebAILanguageDetector = exports.WebAISummarizer = exports.WebAITranslator = void 0;
// Export AI core classes
var translator_1 = require("./ai/translator");
Object.defineProperty(exports, "WebAITranslator", { enumerable: true, get: function () { return translator_1.WebAITranslator; } });
var summarizer_1 = require("./ai/summarizer");
Object.defineProperty(exports, "WebAISummarizer", { enumerable: true, get: function () { return summarizer_1.WebAISummarizer; } });
var language_detector_1 = require("./ai/language-detector");
Object.defineProperty(exports, "WebAILanguageDetector", { enumerable: true, get: function () { return language_detector_1.WebAILanguageDetector; } });
var writer_1 = require("./ai/writer");
Object.defineProperty(exports, "WebAIWriter", { enumerable: true, get: function () { return writer_1.WebAIWriter; } });
var rewriter_1 = require("./ai/rewriter");
Object.defineProperty(exports, "WebAIRewriter", { enumerable: true, get: function () { return rewriter_1.WebAIRewriter; } });
// Export types
__exportStar(require("./types/web-ai"), exports);
// Export utility functions (to be added)
// export * from './utils';
// Version info
exports.VERSION = '2.0.0';
//# sourceMappingURL=index.js.map