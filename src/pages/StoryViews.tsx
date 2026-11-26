import { ArrowLeft, ArrowRight, Globe, MapPin } from 'lucide-react';
import { useState } from 'react';
import { IMAGES } from '../data/catalog';
import {
  CAMPAIGNS,
  type CampaignStory,
  GLOBAL_HUBS,
  TIMELINE_MILESTONES,
} from '../data/heritage';
import { GlobeCanvas } from '../three/GlobeCanvas';

export function CampaignsView({ standalone = false }: { standalone?: boolean }) {
  const [activeCampaign, setActiveCampaign] = useState<CampaignStory | null>(null);

  if (activeCampaign) {
    return (
      <div className="min-h-screen bg-[#09090B] pt-24 pb-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <button
            type="button"
            onClick={() => setActiveCampaign(null)}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Campaigns</span>
          </button>

          <div className="mt-6 border-b border-white/10 pb-8">
            <p className="text-xs text-zinc-400">
              {activeCampaign.label} · {activeCampaign.collection}
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase text-white sm:text-7xl">
              {activeCampaign.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-zinc-300">
              {activeCampaign.lead}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="overflow-hidden border border-white/10 bg-[#121215] lg:col-span-8">
              <img
                src={activeCampaign.heroImage}
                alt={activeCampaign.title}
                referrerPolicy="no-referrer"
                className="h-[420px] sm:h-[560px] w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between border border-white/10 bg-[#121215] p-6 sm:p-8 lg:col-span-4">
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold uppercase text-white">
                  {activeCampaign.subtitle}
                </h2>
                {activeCampaign.paragraphs.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-zinc-300">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-8 border-t border-white/10 pt-5 space-y-1.5 text-xs text-zinc-400">
                {activeCampaign.credits.map((c) => (
                  <p key={c}>{c}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden border border-white/10 bg-[#121215]">
            <img
              src={activeCampaign.secondaryImage}
              alt={`${activeCampaign.title} secondary study`}
              referrerPolicy="no-referrer"
              className="h-[320px] sm:h-[440px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`border-t border-white/10 bg-[#0d0d10] ${
        standalone ? 'pt-24 pb-20 min-h-screen' : 'py-16 sm:py-24'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
              Visual Storytelling & Editorial Chapters
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase text-white sm:text-6xl">
              Conceptual Campaigns
            </h2>
          </div>
          <p className="max-w-md text-xs text-zinc-400">
            Original studio art direction celebrating Adidas silhouettes and sports heritage. Conceptual editorial works are distinct from official brand campaigns.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {CAMPAIGNS.map((camp) => (
            <button
              key={camp.id}
              type="button"
              onClick={() => setActiveCampaign(camp)}
              className="group flex flex-col border border-white/10 bg-[#121215] text-left hover:border-white/40 transition-colors"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#18181B]">
                <img
                  src={camp.heroImage}
                  alt={camp.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-xs text-zinc-400">
                    {camp.label} · {camp.collection}
                  </p>
                  <h3 className="mt-1.5 font-display text-3xl font-bold uppercase text-white">
                    {camp.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {camp.lead}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-white">
                  <span>Open Editorial</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandStorySection({ standalone = false }: { standalone?: boolean }) {
  const [activeHubId, setActiveHubId] = useState<string>(GLOBAL_HUBS[0].id);
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number>(0);

  const activeHub =
    GLOBAL_HUBS.find((h) => h.id === activeHubId) || GLOBAL_HUBS[0];
  const activeMilestone = TIMELINE_MILESTONES[activeMilestoneIdx] || TIMELINE_MILESTONES[0];

  return (
    <section
      className={`border-t border-white/10 bg-[#09090B] ${
        standalone ? 'pt-24 pb-20 min-h-screen' : 'py-16 sm:py-24'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 space-y-20">
        {/* Part 1: Interactive 3D Global Brand Experience */}
        <div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
                Global Sporting & Cultural Footprint
              </p>
              <h2 className="mt-2 font-display text-4xl font-bold uppercase text-white sm:text-6xl">
                Interactive 3D World Map
              </h2>
            </div>
            <p className="max-w-md text-xs text-zinc-400">
              Drag the 3D globe or select a city marker to explore verified Adidas heritage hubs, design studios, and cultural milestones.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            <div className="relative border border-white/10 bg-[#121215] lg:col-span-7 min-h-[380px] sm:min-h-[480px]">
              <GlobeCanvas
                hubs={GLOBAL_HUBS}
                activeHubId={activeHubId}
                onSelectHub={setActiveHubId}
              />
              <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 text-xs text-zinc-400">
                <Globe className="h-3.5 w-3.5" />
                <span>Click pins or drag to orbit</span>
              </div>
            </div>

            <div className="flex flex-col justify-between border border-white/10 bg-[#121215] p-6 sm:p-8 lg:col-span-5">
              <div>
                <div className="flex flex-wrap gap-2 border-b border-white/10 pb-5">
                  {GLOBAL_HUBS.map((hub) => (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => setActiveHubId(hub.id)}
                      className={`flex h-8 items-center gap-1.5 px-3 text-xs transition-colors whitespace-nowrap shrink-0 ${
                        hub.id === activeHubId
                          ? 'bg-white text-[#09090B] font-semibold'
                          : 'border border-white/15 text-zinc-300 hover:border-white/40'
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      <span>{hub.city}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>{activeHub.country}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeHub.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tech">{activeHub.highlightYear}</span>
                  </div>
                  <h3 className="mt-2 font-display text-3xl font-bold uppercase text-white">
                    {activeHub.city} — {activeHub.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                    {activeHub.story}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-4 font-mono-tech text-xs text-zinc-500">
                Coordinates: {activeHub.lat.toFixed(2)}° N, {activeHub.lon.toFixed(2)}° E
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Verified Brand Heritage Timeline */}
        <div>
          <div className="border-b border-white/10 pb-8">
            <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
              Brand Story & Heritage Archive
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase text-white sm:text-6xl">
              From Adi Dassler’s Workbench
            </h2>
          </div>

          {/* Year selector strip */}
          <div className="mt-6 flex flex-wrap gap-2">
            {TIMELINE_MILESTONES.map((m, idx) => (
              <button
                key={m.year}
                type="button"
                onClick={() => setActiveMilestoneIdx(idx)}
                className={`h-10 px-4 font-mono-tech text-xs transition-colors whitespace-nowrap shrink-0 ${
                  idx === activeMilestoneIdx
                    ? 'bg-white text-[#09090B] font-semibold'
                    : 'border border-white/15 text-zinc-300 hover:border-white/40'
                }`}
              >
                {m.year}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            <div className="overflow-hidden border border-white/10 bg-[#121215] lg:col-span-7">
              <img
                src={activeMilestone.image || IMAGES.heritage}
                alt={`${activeMilestone.year} — ${activeMilestone.title}`}
                referrerPolicy="no-referrer"
                className="h-[320px] sm:h-[420px] w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between border border-white/10 bg-[#121215] p-6 sm:p-8 lg:col-span-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-mono-tech text-white">{activeMilestone.year}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeMilestone.location}</span>
                </div>
                <h3 className="mt-2 font-display text-3xl font-bold uppercase text-white">
                  {activeMilestone.title}
                </h3>
                <p className="mt-4 text-sm font-medium text-zinc-200">
                  {activeMilestone.summary}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {activeMilestone.detail}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                <button
                  type="button"
                  disabled={activeMilestoneIdx === 0}
                  onClick={() => setActiveMilestoneIdx((i) => Math.max(0, i - 1))}
                  className="text-zinc-300 hover:text-white disabled:opacity-30"
                >
                  ← Previous Era
                </button>
                <button
                  type="button"
                  disabled={activeMilestoneIdx === TIMELINE_MILESTONES.length - 1}
                  onClick={() =>
                    setActiveMilestoneIdx((i) =>
                      Math.min(TIMELINE_MILESTONES.length - 1, i + 1)
                    )
                  }
                  className="text-zinc-300 hover:text-white disabled:opacity-30"
                >
                  Next Era →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
