import * as React from "react";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../ui/card";
import { PosterFrame } from "../../ui/poster-frame";
import { Separator } from "../../ui/separator";

export interface TravelOverviewDestination {
  id: string;
  title: string;
  subtitle: string;
  media?: React.ReactNode;
}

export interface TravelOverviewTrip {
  title: string;
  dates: string;
  summary: string;
  media?: React.ReactNode;
}

export interface TravelOverviewJournalEntry {
  id: string;
  title: string;
  date: string;
  media?: React.ReactNode;
}

export interface TravelOverviewProps {
  destinations: TravelOverviewDestination[];
  journalEntries: TravelOverviewJournalEntry[];
  trip: TravelOverviewTrip;
}

export function TravelOverview({
  destinations,
  journalEntries,
  trip
}: TravelOverviewProps) {
  return (
    <div className="grid gap-8">
      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              Explore Magical Places
            </h2>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              Scenic destinations arranged like paper postcards.
            </p>
          </div>
          <Button variant="ghost">
            See all
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {destinations.map((destination) => (
            <PosterFrame caption={destination.subtitle} key={destination.id}>
              <div className="aspect-[4/3] bg-[color:var(--secondary)]">{destination.media}</div>
              <div className="border-t border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                {destination.title}
              </div>
            </PosterFrame>
          ))}
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Your Upcoming Trip</CardTitle>
          <CardDescription>
            A broad paper card for a highlighted journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <PosterFrame>
            <div className="aspect-[4/3] bg-[color:var(--secondary)]">{trip.media}</div>
          </PosterFrame>
          <div className="grid gap-3">
            <h3 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              {trip.title}
            </h3>
            <p className="text-sm tracking-[0.14em] uppercase text-[color:var(--muted-foreground)]">
              {trip.dates}
            </p>
            <p className="max-w-[45ch] text-sm leading-7 text-[color:var(--muted-foreground)]">
              {trip.summary}
            </p>
            <div>
              <Button>View details</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
            Travel Journal
          </h2>
          <Button variant="ghost">
            View all
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {journalEntries.map((entry, index) => (
            <Card key={entry.id}>
              <CardContent className="grid gap-4 pt-6 md:grid-cols-[0.95fr_1.05fr] md:items-center">
                <PosterFrame>
                  <div className="aspect-[4/3] bg-[color:var(--secondary)]">{entry.media}</div>
                </PosterFrame>
                <div className="grid gap-2">
                  <p className="text-sm tracking-[0.14em] uppercase text-[color:var(--muted-foreground)]">
                    {entry.date}
                  </p>
                  <h3 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
                    {entry.title}
                  </h3>
                  <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                    Gentle card layouts that can scale from app dashboards to editorial pages.
                  </p>
                  {index === 0 ? <Separator className="mt-1" /> : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
