// @flow
import styled from "styled-components";

const InlineCode = styled.code.attrs({
  spellCheck: false,
})`
  color: #bd10e0;
  font-size: 1em;
  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  &:after {
    content: "׳";
  }
  &:before {
    content: "׳";
  }
`;

export default InlineCode;
