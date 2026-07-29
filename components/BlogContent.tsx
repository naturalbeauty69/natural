export default function BlogContent({ content }: { content: string }) {
  const blocks = content.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-2 font-display text-xl text-emerald-900">
              {block.replace("## ", "")}
            </h2>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-ink-soft">
            {block}
          </p>
        );
      })}
    </div>
  );
}
