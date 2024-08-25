import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { doc, getDoc, setDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const MarkdownEditor = ({ docId, isNew, onSave }) => {
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (docId && !isNew) {
        const docRef = doc(db, 'blogs', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setMarkdownContent(data.content);
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchMarkdown();
  }, [docId, isNew]);

  const handleSave = async () => {
    if (isNew) {
      onSave(title, markdownContent);
      setTitle('');
      setMarkdownContent('');
    } else {
      const docRef = doc(db, 'blogs', docId);
      await setDoc(docRef, { title, content: markdownContent, time: Timestamp.now() }, { merge: true });
      onSave();
      alert('Markdown content saved!');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-4">
      <input
        className="w-full bg-gray-900 text-white p-2 rounded"
        placeholder="Blog title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full bg-gray-900 text-white p-2 rounded mt-2"
        value={markdownContent}
        onChange={(e) => setMarkdownContent(e.target.value)}
        placeholder="Type your markdown content here..."
        rows="10"
      />
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Save</button>
      <div className="mt-4 bg-gray-700 p-4 rounded text-white">
        <h3 className="text-xl font-bold mb-2">Markdown Preview</h3>
        <ReactMarkdown
        remarkPlugins={remarkGfm}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={okaidia}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;