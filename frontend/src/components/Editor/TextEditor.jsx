/** @format */

import React from "react";

const TextEditor = ({ text, updateText }) => {
  return (
    <textarea
      className="w-full h-full border p-2 resize-none"
      value={text}
      onChange={(e) => updateText(e.target.value)}
      spellCheck={false}
    />
  );
};

export default TextEditor;
