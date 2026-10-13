import { Info } from "lucide-react";
import { Bicycle, Earbuds, Laptop } from "@/components/illustrations/Items";
import ItemCard from "@/components/landing/ItemCard";
import SectionHeading from "@/components/landing/SectionHeading";
import Reveal from "@/components/ui/Reveal";

/** Illustrative posts that show what a feed card carries. Not live data. */
export default function FeedPreview() {
  return (
    <section id="feed" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="The feed"
        title="Everything lost and found, in one place"
        description="Coral means lost, emerald means found. Every card shows the item, where it was last seen and when, so you can spot yours in seconds."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Reveal index={0}>
          <ItemCard
            type="LOST"
            title="Black Hero Sprint bicycle"
            place="Library, Gate 2"
            time="2h ago"
            reward={500}
            tile="mint"
            art={<Bicycle className="w-60" />}
          />
        </Reveal>
        <Reveal index={1}>
          <ItemCard
            type="FOUND"
            title="White earbuds charging case"
            place="Satluj common room"
            time="5h ago"
            tile="lavender"
            art={<Earbuds className="w-28" />}
          />
        </Reveal>
        <Reveal index={2} className="md:max-lg:col-span-2 md:max-lg:mx-auto md:max-lg:w-1/2">
          <ItemCard
            type="LOST"
            title="Laptop in a grey sleeve"
            place="Lab Block C"
            time="Yesterday"
            reward={500}
            tile="sky"
            art={<Laptop className="w-52" />}
          />
        </Reveal>
      </div>

      <Reveal className="mt-8 flex justify-center">
        <p className="inline-flex items-center gap-2.5 rounded-3xl bg-sand px-4 py-2.5 text-sm font-semibold text-muted">
          <Info className="size-4 shrink-0" aria-hidden="true" />
          Sample posts for illustration. The live campus feed is the next thing we&apos;re building.
        </p>
      </Reveal>
    </section>
  );
}
