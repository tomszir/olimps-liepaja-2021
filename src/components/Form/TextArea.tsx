import React from 'react';
import styled from 'styled-components';

import { StyledObject } from '@/types';

const S: StyledObject = {};

S.Wrapper = styled.div`
  width: 100%;

  & + & {
    margin-top: 12px;
  }
`;

S.Label = styled.h5`
  margin-bottom: 10px;
  color: #f1f1f1;
  font-family: 'Poppins', sans-serif;
`;

S.TextArea = styled.textarea`
  resize: none;
  outline: none;

  width: 100%;
  height: 160px;
  padding: 8px 12px;

  border-radius: 4px;
  border: 1px solid transparent;

  color: #f1f1f1;
  background-color: #434349;

  font-size: 14px;
  font-family: 'Poppins', sans-serif;

  &:hover,
  &:focus {
    border-color: #f1f1f1;
    background-color: #4343495f;
  }

  &:focus {
    box-shadow: 0 0 0 4px #f1f1f13f;
  }
`;

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: any;
  defaultValue?: any;

  onFocus?: () => void;
  onSubmit?: () => void;
  onEnter?: () => void;
  onChange?: (value: string) => void;
}

const TextArea: React.FC<InputProps> = ({
  label,
  value,
  defaultValue,
  onChange,
  onEnter,
  ...props
}) => {
  const [currentValue, setValue] = React.useState<any>(defaultValue || '');

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (onChange) {
      onChange(e.target.value as string);
    }
  };

  const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (onEnter) {
        onEnter();
      }
    }
  };

  return (
    <S.Wrapper>
      {label && <S.Label>{label}</S.Label>}
      <S.TextArea
        value={value ? value : currentValue}
        onChange={onInputChange}
        onKeyDown={onKeydown}
        {...props}
      />
    </S.Wrapper>
  );
};

export default TextArea;
