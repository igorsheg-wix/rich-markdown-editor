// @flow
import * as React from "react";
import { map } from "lodash";
import styled from "styled-components";
import type { SlateNodeProps } from "../types";
import CopyButton from "./CopyButton";

function getCopyText(node) {
  return node.nodes.reduce((memo, line) => `${memo}${line.text}\n`, "");
}

const languages = {
  none: "None",
  bash: "Bash",
  css: "CSS",
  clike: "C",
  csharp: "C#",
  markup: "HTML",
  java: "Java",
  javascript: "JavaScript",
  php: "PHP",
  powershell: "Powershell",
  python: "Python",
  ruby: "Ruby",
  typescript: "TypeScript",
};

export default function CodeBlock({
  children,
  node,
  readOnly,
  attributes,
  editor,
}: SlateNodeProps) {
  const { data } = node;
  const language = data.get("language") || "javascript";

  const onSelectLanguage = ev => {
    editor.setNodeByKey(node.key, {
      data: { ...data, language: ev.target.value },
    });
  };

  return (
    <Container {...attributes} spellCheck={false}>
      {readOnly && <CopyButton text={getCopyText(node)} />}
      <Code>{children}</Code>
      {!readOnly && (
        <Language
          onChange={onSelectLanguage}
          value={language}
          contentEditable={false}
        >
          {map(languages, (name, value) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </Language>
      )}
    </Container>
  );
}

/*
  Based on Prism template by Bram de Haan (http://atelierbram.github.io/syntax-highlighting/prism/)
  Original Base16 color scheme by Chris Kempson (https://github.com/chriskempson/base16)
*/
const Code = styled.code`
  display: block;
  overflow-x: auto;
  padding: 24px;
  border-radius: 6px;
  caret-color: ${props => props.theme.black};
  line-height: 1.4em;
  background: #fafafa;
  border: 1px solid #eaeaea;

  code[class*="language-"],
  pre[class*="language-"] {
    color: #000;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    font-size: 0.875em;
    line-height: 1.575em;
    tab-size: 4;
    hyphens: none;
  }
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #999;
  }
  .token.namespace {
    opacity: 0.7;
  }
  .token.string,
  .token.attr-value {
    color: #028265;
  }
  .token.punctuation,
  .token.operator {
    color: #000;
  }
  .token.url,
  .token.symbol,
  .token.boolean,
  .token.variable,
  .token.constant {
    color: #36acaa;
  }
  .token.atrule,
  .language-autohotkey .token.selector,
  .language-json .token.boolean,
  code[class*="language-css"] {
    font-weight: 600;
  }
  .language-json .token.boolean {
    color: #0076ff;
  }
  .token.keyword {
    color: #ff0078;
    font-weight: bolder;
  }
  .token.function,
  .token.tag,
  .token.class-name,
  .token.number,
  .token.tag .token.punctuation {
    color: #0076ff;
  }
  .language-autohotkey .token.tag {
    color: #9a050f;
  }
  .token.selector,
  .language-autohotkey .token.keyword {
    color: #00009f;
  }
  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }
  .token.deleted {
    color: red;
    font-weight: bolder;
  }
  .token.inserted {
    color: #0076ff;
    font-weight: bolder;
  }
  .language-json .token.property,
  .language-markdown .token.title {
    color: #000;
    font-weight: bolder;
  }
  .language-markdown .token.code {
    color: #0076ff;
    font-weight: normal;
  }
  .language-markdown .token.list,
  .language-markdown .token.hr {
    color: #999;
  }
  .language-markdown .token.url {
    color: #ff0078;
    font-weight: bolder;
  }
  .token.selector {
    color: #2b91af;
  }
  .token.property,
  .token.entity {
    color: #f00;
  }
  .token.attr-name,
  .token.regex {
    color: #d9931e;
  }
  .token.directive.tag .tag {
    background: #ff0;
    color: #393a34;
  }
  /* dark */
  pre.dark[class*="language-"] {
    color: #fafbfc;
  }
  .language-json .dark .token.boolean {
    color: #0076ff;
  }
  .dark .token.string {
    color: #50e3c2;
  }
  .dark .token.function,
  .dark .token.tag,
  .dark .token.class-name,
  .dark .token.number {
    color: #2ba8ff;
  }
  .dark .token.attr-value,
  .dark .token.punctuation,
  .dark .token.operator {
    color: #efefef;
  }
  .dark .token.attr-name,
  .dark .token.regex {
    color: #fac863;
  }
  .language-json .dark .token.property,
  .language-markdown .dark .token.title {
    color: #fff;
  }
  .language-markdown .dark .token.code {
    color: #50e3c2;
  }
`;

const Language = styled.select`
  position: absolute;
  bottom: 2px;
  right: 2px;
  opacity: 0;
`;

const Container = styled.div`
  position: relative;

  &:hover {
    > span {
      opacity: 1;
    }

    ${Language} {
      opacity: 1;
    }
  }
`;
