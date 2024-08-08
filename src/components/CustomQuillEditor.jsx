import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CustomQuillEditor = ({ value, onChange, modules, formats }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = quillRef.current.getEditor();
    // Any additional setup or customization can be done here.
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      theme="snow"
    />
  );
};

export default CustomQuillEditor;
