import { useState, useEffect, useRef } from 'react';
import prismjs from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import axios from 'axios';
import Markdown from 'react-markdown';

function CodeReviewer() {
    const [code, setCode] = useState('');
    const [review, setReview] = useState('');
    const codeRef = useRef(null);

    useEffect(() => {
        prismjs.highlightAll();
    }, [code, review]);

    const handleReview = async () => {
        const response = await axios.post('http://localhost:3000/ai/get-review', { code });
        setReview(response.data);
    };

    const handleReset = () => {
        setCode('');
        setReview('');
    };

    return (
        <main className="flex min-h-screen bg-gray-900 text-gray-100">
            {/* Left Section */}
            <div className="w-1/2 p-6 border-r border-gray-700">
                <div className="flex flex-col h-full space-y-4">
                    <h2 className="text-xl font-bold text-gray-100">Enter Your Code</h2>

                    <div className="relative flex-1 w-full font-mono text-sm leading-normal">
                        {/* Highlighted code (background layer) */}
                        <pre
                            aria-hidden="true"
                            className="absolute inset-0 p-4 overflow-auto rounded-lg bg-gray-800 text-gray-100 whitespace-pre-wrap break-words font-mono text-sm leading-normal"
                        >
                            <code className="language-js">{code || '/* Start typing your code... */'}</code>
                        </pre>

                        {/* Transparent textarea (foreground layer) */}
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Tab") {
                                    e.preventDefault();
                                    const start = e.target.selectionStart;
                                    const end = e.target.selectionEnd;
                                    const spaces = "    "; // 4 spaces (you can change this to "\t" if you prefer actual tabs)

                                    setCode(code.substring(0, start) + spaces + code.substring(end));
                                    // move caret after inserted spaces
                                    setTimeout(() => {
                                        e.target.selectionStart = e.target.selectionEnd = start + spaces.length;
                                    }, 0);
                                }
                            }}
                            placeholder="Enter your code here..."
                            className="absolute inset-0 w-full h-full p-4 bg-transparent border border-gray-700 rounded-lg resize-none text-transparent caret-white font-mono text-sm leading-normal whitespace-pre-wrap break-words focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>


                    {/* Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={handleReview}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Review
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 p-6">
                <div className="flex flex-col h-full space-y-4">
                    <h2 className="text-xl font-bold text-gray-100">Code Review</h2>
                    <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg shadow-sm p-4 overflow-y-auto max-h-[500px]">
                        {review ? (
                            <pre className="whitespace-pre-wrap text-sm font-mono">
                                <Markdown
                                    components={{
                                        code({ className, children, ...props }) {
                                            return (
                                                <code
                                                    className={className || 'language-js'}
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {review}
                                </Markdown>
                            </pre>
                        ) : (
                            <p className="text-gray-400 italic">
                                Enter code and click "Review" to see the analysis here.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default CodeReviewer;
