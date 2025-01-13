"use client";

import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { log } from "console";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const inputRef = useRef<string | null>(null);
  const { status, results, loadMore, isLoading } = usePaginatedQuery(
    api.messages.get,
    {},
    { initialNumItems: 8 },
  );
  const createMessage = useMutation(api.messages.createMessage);
  const sendExpiringMessage = useMutation(api.messages.sendExpiringMessage);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingUp = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Check if the user is at the bottom
      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;

      isUserScrollingUp.current = !isAtBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef.current]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isUserScrollingUp.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [results]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-dm-sans)]">
      {username === null ? (
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-[family-name:var(--font-phudu)] font-bold text-5xl min-w-80">
              ChatTrack
            </h1>
            <ThemeToggle />
          </div>
          <h2 className="text-sm font-medium sm:text-left">
            Get started by logging in or signing up below
          </h2>

          <hr className="w-full h-[1px] bg-stone-700" />
          <form
            className="w-full flex flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="text"
              placeholder="Username"
              className="flex-auto"
              onChange={(e) => (inputRef.current = e.target.value)}
            />
            <Button type="button" onClick={() => setUsername(inputRef.current)}>
              Get Started
            </Button>
          </form>
        </main>
      ) : (
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex flex-row justify-between items-start w-full min-w-[34rem]">
            <div className="flex flex-col items-start gap-1">
              <h1 className="font-[family-name:var(--font-phudu)] font-bold text-5xl">
                Hello,
              </h1>
              <span className="text-4xl font-bold  font-[family-name:var(--font-phudu)] text-stone-600">
                {username}
              </span>
            </div>
            <ThemeToggle />
          </div>
          <h2 className="text-sm font-medium sm:text-left">
            Get started by logging in or signing up below
          </h2>

          <hr className="w-full h-[1px] bg-stone-700" />
          <div className="border flex flex-col rounded-lg w-full h-[36rem]">
            <div
              ref={containerRef}
              className="flex-grow p-4 flex flex-col max-w-[33rem] overflow-y-auto overflow-x-clip relative"
            >
              {status === "CanLoadMore" && (
                <Button
                  variant={"ghost"}
                  className="mt-2"
                  onClick={() => {
                    loadMore(10);
                  }}
                  disabled={status !== "CanLoadMore"}
                >
                  {isLoading ? (
                    <svg
                      className="text-gray-300 animate-spin"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                    >
                      <path
                        d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-900"
                      ></path>
                    </svg>
                  ) : (
                    <>Load More</>
                  )}
                </Button>
              )}
              {(results.sort((a, b) => a._creationTime - b._creationTime) ?? []).map(
                (message) => (
                  <div key={message._id}>
                    {message.username === "<CONSOLE>" ? (
                      <p className="p-2 text-wrap text-muted-foreground max-w-[28rem] break-after-all">
                        <span className="font-bold text-foreground">{"<CONSOLE>  "}</span>
                        {message.text}
                      </p>
                    ) : (
                      <p className="p-2 text-wrap max-w-[28rem] break-all text-muted-foreground">
                        <strong className="text-foreground">{message.username}: </strong>
                        {message.text}
                      </p>
                    )}
                  </div>
                ),
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (message.trim().length < 1) {
                  return;
                }

                createMessage({ username, message }).finally(() => setMessage(""));
              }}
              className="flex flex-row"
            >
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onSubmit={(e) => {
                  e.preventDefault();

                  if (message.trim().length < 1) {
                    return;
                  }

                  createMessage({ username, message }).finally(() => setMessage(""));
                }}
                className="border-0 border-t rounded-t-none border-r rounded-br-none"
                placeholder="Enter message here ..."
              />
              <Button
                type="button"
                className="ml-2"
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();

                  if (message.trim().length < 1) {
                    return;
                  }

                  sendExpiringMessage({ username, message }).finally(() =>
                    setMessage(""),
                  );
                }}
              >
                Self Destruct
              </Button>
              <Button
                type="button"
                className="ml-2"
                onClick={(e) => {
                  e.preventDefault();

                  if (message.trim().length < 1) {
                    return;
                  }

                  createMessage({ username, message }).finally(() => setMessage(""));
                }}
              >
                Send
              </Button>
            </form>
          </div>
        </main>
      )}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Signout
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          ___
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to home page →
        </a>
      </footer>
    </div>
  );
}

function Loading() {
  return (
    <div className="absolute z-50 bg-background/80 backdrop-blur-md inset-0 flex justify-center items-center">
      <div>
        <svg
          className="text-gray-300 animate-spin"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-900"
          ></path>
        </svg>
      </div>
    </div>
  );
}
