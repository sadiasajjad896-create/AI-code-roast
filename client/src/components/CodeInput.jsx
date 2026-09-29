// Form for submitting code to be roasted.
//
// Props:
// - onSubmit({ code, language }): called when the user clicks "Roast It"
// - loading: boolean, disables the button while the AI responds

import { useState } from 'react';

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'sql',
  'html',
  'css',
  'plaintext',
];

// Display labels for values that shouldn't be shown as-is
const LANGUAGE_LABELS = {
  cpp: 'C++',
};

export default function CodeInput({ onSubmit, loading }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setValidationError('Insert code to continue.');
      return;
    }
    setValidationError('');
    onSubmit({ code, language });
  };

  return (
    <form onSubmit={handleSubmit} className="pixel-card space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="code" className="font-pixel text-xs">
          &gt; Insert code
        </label>

        <select
          aria-label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="cursor-pointer rounded-none border-[3px] border-black bg-white px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:border-arcade-red"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_LABELS[lang] ?? lang}
            </option>
          ))}
        </select>
      </div>

      <textarea
        id="code"
        rows={14}
        spellCheck={false}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// paste your code here..."
        className="block w-full resize-y rounded-none border-[3px] border-black bg-neutral-50 p-3 text-sm leading-relaxed placeholder:text-neutral-400 focus:bg-white focus:outline-none focus-visible:border-arcade-red"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-arcade-red" role="alert">
          {validationError}
        </p>
        <button type="submit" disabled={loading} className="pixel-btn bg-arcade-yellow">
          {loading ? 'Roasting...' : 'Roast It'}
        </button>
      </div>
    </form>
  );
}
