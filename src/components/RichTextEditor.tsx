import React, { useMemo, useState, useEffect } from 'react';

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
  const [ReactQuill, setReactQuill] = useState<any>(null);

  useEffect(() => {
    // Carregar ReactQuill dinamicamente
    const loadQuill = async () => {
      try {
        const { default: Quill } = await import('react-quill');
        // Carregar CSS dinamicamente
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
        document.head.appendChild(link);
        
        setReactQuill(() => Quill);
        setIsQuillLoaded(true);
      } catch (error) {
        console.warn('ReactQuill não pôde ser carregado, usando fallback:', error);
        setIsQuillLoaded(false);
      }
    };

    loadQuill();
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
  if (!isQuillLoaded || !ReactQuill) {
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
            resize: 'vertical',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)'
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


