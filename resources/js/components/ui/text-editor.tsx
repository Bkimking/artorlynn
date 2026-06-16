'use client';
import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface TextEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
}

export default function TextEditor({
    value = '',
    onChange,
    placeholder = 'Describe your event...'
}: TextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link', 'image', 'blockquote', 'code-block'],
                        ['clean']
                    ]
                }
            });

            // Set initial content
            if (value) {
                quillRef.current.root.innerHTML = value;
            }

            // Listen for text changes
            quillRef.current.on('text-change', () => {
                if (quillRef.current && onChange) {
                    onChange(quillRef.current.root.innerHTML);
                }
            });
        }
    }, []); // Remove placeholder from dependency array

    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            // Only update if the content is actually different
            const currentContent = quillRef.current.root.innerHTML;
            if (currentContent !== value) {
                quillRef.current.root.innerHTML = value;
            }
        }
    }, [value]);

    // Update placeholder when it changes
    useEffect(() => {
        if (quillRef.current) {
            quillRef.current.options.placeholder = placeholder;
            // Force a re-render to show the new placeholder
            if (!quillRef.current.hasFocus() && !quillRef.current.getText().trim()) {
                quillRef.current.root.classList.add('ql-blank');
            }
        }
    }, [placeholder]);

    return (
        <div className="quill-wrapper w-full">
            <div ref={editorRef} />
        </div>
    );
}