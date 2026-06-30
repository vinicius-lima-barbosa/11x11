"use client";

import type Konva from "konva";
import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import { useBoardPersistence } from "../hooks/useBoardPersistence";
import { useExportBoard } from "../hooks/useExportBoard";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useTacticalBoardStore } from "../store/tactical-board.store";
import { PropertiesPanel } from "./PropertiesPanel";
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

function subscribeToMountState() {
  return () => undefined;
}

function getClientMountSnapshot() {
  return true;
}

function getServerMountSnapshot() {
  return false;
}

function TacticalBoardShell() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Tactical Board
            </h1>
            <p className="text-xs text-zinc-500">
              Online football tactical board
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-4 py-4 lg:px-6">
        <div className="h-[3.25rem] rounded-lg border border-zinc-200 bg-white shadow-sm" />
        <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_18rem]">
          <section className="min-h-[calc(100vh-11rem)]">
            <div className="h-full min-h-[360px] rounded-lg bg-zinc-950" />
          </section>
          <aside className="w-full rounded-lg border border-zinc-200 bg-white shadow-sm lg:w-72" />
        </div>
      </main>
    </div>
  );
}

function TacticalBoardClient() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const hasHydrated = useTacticalBoardStore((state) => state.hasHydrated);
  const exportBoard = useExportBoard(stageRef);

  useKeyboardShortcuts();
  useBoardPersistence();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Tactical Board
            </h1>
            <p className="text-xs text-zinc-500">
              Online football tactical board
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-4 py-4 lg:px-6">
        <Toolbar onExport={exportBoard} />
        <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_18rem]">
          <section className="min-h-[calc(100vh-11rem)]">
            {hasHydrated ? (
              <ClientBoardStage stageRef={stageRef} />
            ) : (
              <div className="h-full min-h-[360px] rounded-lg bg-zinc-950" />
            )}
          </section>
          <PropertiesPanel />
        </div>
      </main>
    </div>
  );
}

export function TacticalBoard() {
  const isMounted = useSyncExternalStore(
    subscribeToMountState,
    getClientMountSnapshot,
    getServerMountSnapshot,
  );

  if (!isMounted) {
    return <TacticalBoardShell />;
  }

  return <TacticalBoardClient />;
}
