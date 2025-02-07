// @flow
import * as React from "react";
import { Portal } from "react-portal";
import { Editor, findDOMNode } from "slate-react";
import { Node, Value } from "slate";
import styled from "styled-components";
import { isEqual, debounce } from "lodash";
import FormattingToolbar from "./FormattingToolbar";
import LinkToolbar from "./LinkToolbar";

type Props = {
  editor: Editor,
  value: Value,
};

type State = {
  active: boolean,
  link: ?Node,
  button: ?Node,
  top: string,
  left: string,
  mouseDown: boolean,
};

export default class Toolbar extends React.Component<Props, State> {
  state = {
    active: false,
    mouseDown: false,
    link: undefined,
    button: undefined,
    top: "",
    left: "",
  };

  menu: ?HTMLElement;

  componentDidMount = () => {
    this.update();
    if (typeof window !== "undefined") {
      window.addEventListener("mousedown", this.handleMouseDown);
      window.addEventListener("mouseup", this.handleMouseUp);
    }
  };

  componentWillUnmount = () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousedown", this.handleMouseDown);
      window.removeEventListener("mouseup", this.handleMouseUp);
    }
  };

  componentWillReceiveProps = debounce(() => {
    this.update();
  }, 100);

  hideLinkToolbar = () => {
    this.setState({ link: undefined });
    this.update();
  };

  handleMouseDown = () => {
    this.setState({ mouseDown: true });
    this.update();
  };

  handleMouseUp = () => {
    this.setState({ mouseDown: false });
    this.update();
  };

  showLinkToolbar = (ev: SyntheticEvent<>) => {
    ev.preventDefault();
    ev.stopPropagation();

    const link = this.props.editor.getLinkInSelection();
    const button = this.props.editor.getLinkInSelection();
    this.setState({ link, button });
  };

  update = () => {
    const { value, editor } = this.props;
    const link = editor.getLinkInSelection();
    const selection = window.getSelection();

    // value.isCollapsed is not correct when the user clicks outside of the Slate bounds
    // checking the window selection collapsed state as a fallback for this case
    const isCollapsed = value.selection.isCollapsed || selection.isCollapsed;

    if (isCollapsed && !link) {
      if (this.state.active) {
        const newState = {
          mouseDown: this.state.mouseDown,
          active: false,
          link: undefined,
          top: "",
          left: "",
        };

        if (!isEqual(this.state, newState)) {
          this.setState(newState);
        }
      }
      return;
    }

    let active = true;

    if (!value.startBlock) return;

    // don't display toolbar for code blocks, code-lines or inline code
    if (value.startBlock.type.match(/code/)) active = false;

    // don't show until user has released pointing device button
    if (this.state.mouseDown && !link) active = false;

    const newState = {
      active,
      mouseDown: this.state.mouseDown,
      link: this.state.link || link,
      top: undefined,
      left: undefined,
    };
    const padding = 16;
    let rect;

    if (link) {
      try {
        rect = findDOMNode(link).getBoundingClientRect();
      } catch (err) {
        // TODO
      }
    } else if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      rect = range.getBoundingClientRect();
    }

    if (!rect || !this.menu || (rect.top === 0 && rect.left === 0)) {
      return;
    }

    const left =
      rect.left + window.scrollX - this.menu.offsetWidth / 2 + rect.width / 2;
    newState.top = `${Math.round(
      rect.top + window.scrollY - this.menu.offsetHeight
    )}px`;
    newState.left = `${Math.round(Math.max(padding, left))}px`;

    if (!isEqual(this.state, newState)) {
      this.setState(newState);
    }
  };

  render() {
    const style = {
      top: this.state.top,
      left: this.state.left,
    };

    return (
      <Portal>
        <Menu
          active={this.state.active}
          ref={ref => (this.menu = ref)}
          style={style}
        >
          {this.state.link ? (
            <LinkToolbar
              {...this.props}
              link={this.state.link}
              onBlur={this.hideLinkToolbar}
            />
          ) : (
            <FormattingToolbar
              onCreateLink={this.showLinkToolbar}
              {...this.props}
            />
          )}
        </Menu>
      </Portal>
    );
  }
}

export const Menu = styled.div`
  padding: 10px;
  position: absolute;
  z-index: ${props => {
    return props.theme.zIndex + 999;
  }};
  top: -10000px;
  left: -10000px;
  opacity: 0;
  background-color: ${props => props.theme.toolbarBackground};
  border-radius: 4px;
  transform: scale(0.95);
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 150ms;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 7px 25px 0 rgba(0, 0, 0, 0.03),
    0 4px 12px 0 rgba(0, 0, 0, 0.03);
  line-height: 0;
  height: 42px;
  display: flex;
  box-sizing: border-box;
  pointer-events: none;
  white-space: nowrap;

  &::before,
  &::after {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &::after {
    border-color: rgba(136, 183, 213, 0);
    border-top-color: white;
    border-width: 9px;
    margin-left: -9px;
  }
  &::before {
    border-color: rgba(194, 225, 245, 0);
    border-top-color: rgba(0, 0, 0, 0.1);
    border-width: 10px;
    margin-left: -10px;
  }

  * {
    box-sizing: border-box;
  }

  ${({ active }) =>
    active &&
    `
    transform: translateY(-16px) scale(1);
    pointer-events: all;
    opacity: 1;
  `};

  @media print {
    display: none;
  }
`;
