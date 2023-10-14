import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { useState } from "react";

import { Header } from "~/components/Header";
import { NoteEditor } from "~/components/NoteEditor";
import { NoteCard } from "~/components/NoteCard";
import { api } from "~/utils/api";
import { type Note } from "~/types/note";
import { type Topic } from "~/types/topic";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notetaker</title>
        <meta name="description" content="Notetaker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Content />
      </main>
    </>
  );
};
export default Home;

const Content: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data: Topic[]) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    },
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    },
  );

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [selectingNote, setSelectingNote] = useState<Note | null>(null);

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const updateNote = api.note.update.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const startEditingNote = (note: Note | null) => {
    setIsEditingNote(true);
    setSelectingNote(note);
  };

  const endEditingNote = () => {
    setIsEditingNote(false);
    setSelectingNote(null);
  };

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="bg-base100 menu rounded-box w-56 p-2">
          {topics?.map((topic: Topic) => (
            <li key={topic.id}>
              <a
                className={`btn btn-ghost rounded-btn btn-sm ${
                  topic.id === selectedTopic?.id ? "border border-primary" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="New topic"
          className="input input-bordered input-sm w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({ title: e.currentTarget.value });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="col-span-3">
        <div className="col-span-3">
          {notes?.map((note) => (
            <NoteCard
              key={note.topicId + note.id}
              note={note}
              onDelete={() => {
                void deleteNote.mutate({ id: note.id });
              }}
              onEdit={(note) => {
                startEditingNote(note);
              }}
            />
          ))}
        </div>
        {isEditingNote && (
          <NoteEditor
            onSave={({ title, content }) => {
              if (selectingNote === null) {
                void createNote.mutate({
                  title,
                  content,
                  topicId: selectedTopic?.id ?? "",
                });
              } else {
                void updateNote.mutate({
                  id: selectingNote.id,
                  title,
                  content,
                });
              }
              endEditingNote();
            }}
            onCancel={() => {
              endEditingNote();
            }}
            initialNote={selectingNote}
          />
        )}
        {/* 中央にボタンを配置 */}
        {!isEditingNote && (
          <div className="mt-5 flex justify-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                startEditingNote(null);
              }}
            >
              New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
