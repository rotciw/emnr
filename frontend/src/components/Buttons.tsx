import React, { useState } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  clickHandler?: (value?: any) => void;
  children: string;
}

export const LoginButton: React.FC<ButtonProps> = ({
  clickHandler,
  children,
}) => {
  return <button onClick={clickHandler}>{children}</button>;
};
