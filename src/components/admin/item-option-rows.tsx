"use client";

export function ItemOptionRows({
  title,
  options,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  options: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <details className="rounded-lg border border-[#d4dde6] p-3">
      <summary className="cursor-pointer text-xs font-medium text-[#4f6479]">{title}</summary>
      <div className="mt-3">
        <div className="mb-2 flex items-center justify-end">
          <button
            type="button"
            onClick={onAdd}
            className="text-xs font-medium text-[#0f2f4f] underline-offset-2 hover:underline"
          >
            Add more
          </button>
        </div>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={`${title}-${index}`} className="flex gap-2">
              <input
                value={option}
                onChange={(event) => onChange(index, event.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-md border border-[#d4dde6] px-2 text-xs text-[#35506a] hover:bg-[#edf2f8]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
