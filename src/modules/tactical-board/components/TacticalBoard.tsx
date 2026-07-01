"use client";

import Logo11x11 from "@/../public/11x11-logo.png";
import type Konva from "konva";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { useBoardPersistence } from "../hooks/useBoardPersistence";
import { useExportBoard } from "../hooks/useExportBoard";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useTacticalBoardStore } from "../store/tactical-board.store";
import { Toolbar } from "./Toolbar";

const ClientBoardStage = dynamic(
  () => import("./BoardStage").then((module) => module.BoardStage),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[360px] items-center justify-center rounded-lg bg-zinc-950 text-sm text-zinc-300">
        Loading board...
      </div>
    ),
  },
);

function TacticalBoardClient() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const hasHydrated = useTacticalBoardStore((state) => state.hasHydrated);
  const exportBoard = useExportBoard(stageRef);

  useKeyboardShortcuts();
  useBoardPersistence();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-2 py-3 sm:px-4 sm:py-4 lg:px-6">
          <div>
            <Image
              src={Logo11x11}
              alt="Tactical Board Logo"
              className="h-auto w-16 sm:w-20"
              loading="eager"
            />
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">
              Your Online Tactical Board
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4 lg:px-6">
        <Toolbar onExport={exportBoard} />
        <section className="min-h-[320px] flex-1 sm:min-h-[420px] lg:min-h-[calc(100vh-12rem)]">
          {hasHydrated ? (
            <ClientBoardStage stageRef={stageRef} />
          ) : (
            <div className="h-full min-h-[320px] rounded-lg bg-zinc-950 sm:min-h-[420px]" />
          )}
        </section>
      </main>
    </div>
  );
}

export function TacticalBoard() {
  return <TacticalBoardClient />;
}
