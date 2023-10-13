import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { useState } from "react";

import { Header } from "~/components/Header";
import { api, type RouterOutputs } from "~/utils/api";

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

type Topic = RouterOutputs["topic"]["getAll"][0]

const Content: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic ] = useState<Topic | null>(null);

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data: Topic[]) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      }
    },
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="bg-base100 menu rounded-box w-56 p-2">
          {topics?.map((topic: Topic) => (
            <li key={topic.id}>
              <a
                className="btn btn-ghost rounded-btn btn-sm"
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
      <div className="col-span-3"></div>
    </div>
  );
};
