"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.AIRewriterElement = exports.AIWriterElement = exports.AILanguageDetectorElement = exports.AISummarizerElement = exports.AITranslatorElement = void 0;
// Export all AI web components
var ai_translator_1 = require("./components/ai-translator");
Object.defineProperty(exports, "AITranslatorElement", { enumerable: true, get: function () { return ai_translator_1.AITranslatorElement; } });
var ai_summarizer_1 = require("./components/ai-summarizer");
Object.defineProperty(exports, "AISummarizerElement", { enumerable: true, get: function () { return ai_summarizer_1.AISummarizerElement; } });
var ai_language_detector_1 = require("./components/ai-language-detector");
Object.defineProperty(exports, "AILanguageDetectorElement", { enumerable: true, get: function () { return ai_language_detector_1.AILanguageDetectorElement; } });
var ai_writer_1 = require("./components/ai-writer");
Object.defineProperty(exports, "AIWriterElement", { enumerable: true, get: function () { return ai_writer_1.AIWriterElement; } });
var ai_rewriter_1 = require("./components/ai-rewriter");
Object.defineProperty(exports, "AIRewriterElement", { enumerable: true, get: function () { return ai_rewriter_1.AIRewriterElement; } });
// Register all components
require("./components/ai-translator");
require("./components/ai-summarizer");
require("./components/ai-language-detector");
require("./components/ai-writer");
require("./components/ai-rewriter");
// Version info
exports.VERSION = '1.0.0';
//# sourceMappingURL=index.js.map