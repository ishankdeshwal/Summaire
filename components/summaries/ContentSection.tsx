function parsePoint(point: string) {
  const isNumbered = /^\d+\./.test(point);
  const isMainPoint = /^•/.test(point);
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u2600-\u26FF]/u;
  const hasEmoji = emojiRegex.test(point);
  const isEmpty = !point.trim();

  return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}

function parseEmojiPoint(content: string) {
  const cleanContent = content.replace(/^[•-]\s*/, "").trim();

  // Match leading emoji(s) + text
  const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);
  if (!matches) return null;

  const [, emoji, text] = matches;

  return {
    emoji: emoji.trim(),
    text: text.trim(),
  };
}

export default function ContentSection({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <div className="space-y-4">
      {points.map((point, idx) => {
        const { isNumbered, isMainPoint, hasEmoji, isEmpty } =
          parsePoint(point);

        // Default: show the whole string
        let emoji = "";
        let text = point.trim();

        // If emoji point → split into emoji + text
        if (hasEmoji) {
          const parsed = parseEmojiPoint(point);
          if (parsed) {
            emoji = parsed.emoji;
            text = parsed.text;
          }
        }

        if (isEmpty) return null;

        return (
          <div
            key={`point-${idx}`}
            className="group relative bg-linear-to-br from-gray-200/[0.08] to-gray-400/[0.03] p-2 rounded-2xl border border-gray-500/10 hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-linear-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative flex items-start gap-3">
              {emoji && <span className="text-lg lg:text-xl shrink-0 pt-1">{emoji}</span>}
              <p className="text-lg lg:text-xl">{text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
