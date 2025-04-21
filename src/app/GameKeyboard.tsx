'use client';

import React, { useEffect } from 'react';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

type Props = {
  onInput: (input: string) => void;
};

const GameKeyboard: React.FC<Props> = ({ onInput }) => {
  useEffect(() => {
    const keyboard = new Keyboard({
      onChange: (input) => onInput(input),
      layoutName: 'default',
      layout: {
        default: [
          'q w e r t y u i o p',
          'a s d f g h j k l',
          'z x c v b n m',
          '{bksp} {space} {enter}'
        ]
      },
      display: {
        '{bksp}': '⌫',
        '{enter}': '⏎',
        '{space}': '␣'
      }
    });

    return () => {
      keyboard.destroy(); // clean up
    };
  }, [onInput]);

  return <div className="simple-keyboard" />;
};

export default GameKeyboard;
