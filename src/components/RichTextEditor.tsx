import React, { useMemo, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Digite o conteúdo da nota...",
  height = 200,
}) => {
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);

  useEffect(() => {
    // Verificar se o ReactQuill está disponível
    setIsQuillLoaded(true);
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'blockquote', 'code-block'
  ];

  // Fallback para textarea simples se o ReactQuill não carregar
  if (!isQuillLoaded) {
    return (
      <div className="rich-text-editor">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ 
            height: `${height}px`,
            width: '100%',
            padding: '12px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: `${height}px` }}
      />
    </div>
  );
};


