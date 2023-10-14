import { useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { type Note } from "~/types/note";

export const NoteEditor = ({
  onSave,
  onCancel,
  initialNote,
}: {
  onSave: (note: { title: string; content: string }) => void;
  onCancel: () => void;
  initialNote: Note | null;
}) => {
  const [code, setCode] = useState(initialNote?.content ?? "");
  const [title, setTitle] = useState(initialNote?.title ?? "");
  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type="text"
            placeholder="Note title"
            className="input input-primary input-lg w-full font-bold"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(v) => setCode(v)}
          className="border border-gray-300"
        />
      </div>
      <div className="card-actions m-2 justify-end">
        <button
          className="btn-transparent btn"
          onClick={() => {
            onCancel();
            setTitle("");
            setCode("");
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          disabled={title.trim().length === 0 || code.trim().length === 0}
          onClick={() => {
            onSave({ title, content: code });
            setTitle("");
            setCode("");
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
