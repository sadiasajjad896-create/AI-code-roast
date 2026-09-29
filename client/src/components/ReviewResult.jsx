// Displays the AI's review of the submitted code.
//
// Props:
// - review: Review object ({ code, language, review, createdAt }) or null
// - loading: boolean
// - error: string | null
//
// The server prompt asks for "**Roast:** ..." followed by "**Heading:**" sections
// with "- " bullets; parseReview() splits that into a headline + sections.

const ROAST_RE = /^\*{0,2}roast\*{0,2}\s*:\s*\*{0,2}\s*(.+)$/i;
const HEADING_RE = /^(?:#{1,6}\s+(.+?)|\*\*(.+?)\*\*)\s*:?\s*$/;
const BULLET_RE = /^(?:[-*•]|\d+[.)])\s+(.+)$/;

const parseReview = (text = '') => {
  let roast = null;
  const sections = [];
  let current = null;

  const ensureSection = (title = null) => {
    current = { title, items: [] };
    sections.push(current);
  };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    const roastMatch = !roast && line.match(ROAST_RE);
    if (roastMatch) {
      roast = roastMatch[1].replace(/\*\*/g, '').trim();
      continue;
    }

    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      ensureSection((headingMatch[1] || headingMatch[2]).replace(/:$/, '').trim());
      continue;
    }

    if (!current) ensureSection();
    const bulletMatch = line.match(BULLET_RE);
    current.items.push(bulletMatch ? { bullet: true, text: bulletMatch[1] } : { bullet: false, text: line });
  }

  return { roast, sections: sections.filter((s) => s.items.length) };
};

// Minimal inline formatting: `code` and **bold**
const renderInline = (text) =>
  text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="border border-black bg-neutral-100 px-1 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });

function Panel({ children }) {
  return <section className="pixel-card p-6 text-center">{children}</section>;
}

export default function ReviewResult({ review, loading, error }) {
  if (loading) {
    return (
      <Panel>
        <p className="font-pixel animate-pulse text-xs">Roasting your code...</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel>
        <p className="font-pixel mb-3 inline-block border-[3px] border-black bg-arcade-red px-3 py-2 text-xs text-white">
          Game over
        </p>
        <p className="text-sm">{error}</p>
      </Panel>
    );
  }

  if (!review) {
    return (
      <Panel>
        <p className="font-pixel text-xs text-neutral-500">Press Roast It to start</p>
      </Panel>
    );
  }

  const { roast, sections } = parseReview(review.review);

  return (
    <section className="space-y-6">
      {roast && (
        <div className="border-[3px] border-black bg-arcade-red shadow-pixel">
          <span className="font-pixel inline-block border-b-[3px] border-r-[3px] border-black bg-black px-3 py-2 text-[10px] text-arcade-yellow">
            Roast
          </span>
          <p className="px-4 pb-4 pt-3 text-lg font-bold leading-snug text-black">{renderInline(roast)}</p>
        </div>
      )}

      <div className="pixel-card space-y-6 p-5">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <h3 className="font-pixel mb-3 flex items-center gap-2 text-[10px] uppercase">
                <span className="inline-block h-2.5 w-2.5 bg-arcade-red" aria-hidden="true" />
                {section.title}
              </h3>
            )}
            <ul className="space-y-2 text-sm leading-relaxed">
              {section.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  {item.bullet && <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" aria-hidden="true" />}
                  <span>{renderInline(item.text)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
