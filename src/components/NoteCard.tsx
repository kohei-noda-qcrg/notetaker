import { useState } from "react";

import ReactMarkdown from "react-markdown";

import { type Note } from "~/types/note";

export const NoteCard = ({
  note,
  onDelete,
  onEdit,
}: {
  note: Note;
  onDelete: () => void;
  onEdit: (note: Note) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div className="border-gary-200 card mt-5 border bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        <div
          className={`collapse collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          }`}
        >
          <div
            className="collapse-title text-xl font-bold"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {note.title}
          </div>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">
              {/* prose: https://tailwindcss.com/docs/typography-plugin */}
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>
          <div className="card-actions mx-2 flex justify-end">
            <button
              className="btn btn-primary btn-xs px-5"
              onClick={() => onEdit(note)}
            >
              Edit
            </button>
            <button className="btn btn-warning btn-xs px-5" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
