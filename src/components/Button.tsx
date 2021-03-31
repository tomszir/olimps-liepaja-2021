import React from 'react';
import styled, { css } from 'styled-components';

import { StyledObject } from '@/types';

const S: StyledObject = {};

export interface ButtonStyleProps {
  type?: 'primary' | 'danger';
  disabled?: boolean;
}

export type ButtonProps = {
  label: string;
  onClick?: () => void;
} & ButtonStyleProps;

S.Button = styled.button<ButtonStyleProps>`
  cursor: pointer;

  font-family: 'Poppins', sans-serif;

  border: none;
  outline: none;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px 16px;
  border-radius: 4px;

  text-decoration: none;

  color: #f1f1f1;
  background-color: #141419;

  &:hover {
    opacity: 0.8;
  }

  ${p =>
    p.type === 'primary' &&
    css`
      background-color: #3eb489;
    `}

  ${p =>
    p.type === 'danger' &&
    css`
      background-color: #e74a55;
    `}

  ${p =>
    p.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.8;
    `}
`;

const Button: React.FC<ButtonProps> = ({ label, onClick, ...props }) => {
  const handleClick = () => onClick && !props.disabled && onClick();

  return (
    <S.Button onClick={handleClick} {...props}>
      {label}
    </S.Button>
  );
};

export default Button;
