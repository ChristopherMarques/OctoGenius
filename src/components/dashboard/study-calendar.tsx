"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as RBCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

type StudySession = {
  id: string;
  scheduled_date: string;
  duration_minutes: number | null;
  topic: string | null;
  task_type: string | null;
  status: string;
};

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export function StudyCalendar() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selected, setSelected] = useState<StudySession | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch("/api/study/sessions?me=1", { method: "GET" });
      if (!res.ok) return;
      const json = await res.json();
      setSessions(json?.sessions || []);
    };
    fetchSessions();
  }, []);

  const events = useMemo(() => {
    return sessions.map((s: StudySession) => {
      const d = new Date(s.scheduled_date);
      d.setHours(18, 0, 0, 0);
      const end = new Date(d.getTime() + (s.duration_minutes || 30) * 60 * 1000);

      return {
        id: s.id,
        title: `${s.topic || "Sessão"}${s.task_type ? ` — ${s.task_type}` : ""}`,
        start: d,
        end,
        resource: s,
      };
    });
  }, [sessions]);

  return (
    <div className="w-full">
      <RBCalendar
        localizer={localizer}
        events={events as any}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        culture="pt-BR"
        onSelectEvent={(e: any) => setSelected((e as any).resource as StudySession)}
      />

      <Dialog open={!!selected} onOpenChange={(o: boolean) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.topic || "Sessão de Estudo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div>Tipo: {selected?.task_type || "-"}</div>
            <div>Duração: {selected?.duration_minutes ? `${selected?.duration_minutes} min` : "-"}</div>
            <div>Data: {selected?.scheduled_date ? new Date(selected.scheduled_date).toLocaleDateString("pt-BR") : "-"}</div>
            <div>Status: {selected?.status}</div>
          </div>
          <div className="mt-4">
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setSelected(null)}>Fechar</Button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
