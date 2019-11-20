// // @flow
// import * as React from "react";
// import styled from "styled-components";
// import type { SlateNodeProps as Props } from "../types";

// export default function Button(props: Props) {
//   const { attributes, node, children, editor, readOnly } = props;
//   const embed = node.data.get("embed");
//   const Component = node.data.get("component");
//   const href = node.data.get("href");

//   if (embed && Component) {
//     return <Component {...props} />;
//   }

//   return (
//     <StyledButton
//       {...attributes}
//       href={readOnly ? href : undefined}
//       onClick={
//         readOnly
//           ? ev => {
//               if (editor.props.onClickLink) {
//                 ev.preventDefault();
//                 editor.props.onClickLink(href);
//               }
//             }
//           : undefined
//       }
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       {children}
//     </StyledButton>
//   );
// }

// const StyledButton = styled.a`
//   margin: 2em 0;
//   border: 0;
//   border-bottom: 1px solid
//     ${props =>
//       props.isSelected ? props.theme.selected : props.theme.horizontalRule};
// `;

// @flow
import * as React from "react";
import type { SlateNodeProps as Props } from "../types";

export default function Button(props: Props) {
  const { attributes, node, children, editor, readOnly } = props;
  const embed = node.data.get("embed");
  const Component = node.data.get("component");
  const href = node.data.get("href");
  if (embed && Component) {
    return <Component {...props} />;
  }

  return (
    <a
      {...attributes}
      href={readOnly ? href : undefined}
      onClick={
        readOnly
          ? ev => {
              if (editor.props.onClickLink) {
                ev.preventDefault();
                editor.props.onClickLink(href);
              }
            }
          : undefined
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
