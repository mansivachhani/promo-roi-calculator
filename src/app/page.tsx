"use client";

import { useMemo, useState } from "react";

type Inputs = {
  baselineRevenue: string;
  upliftPct: string;
  bonusCost: string;
  churnPct: string;
};

type Preset = {
  label: string;
  description: string;
  values: Inputs;
};

const presets: Preset[] = [
  {
    label: "Conservative",
    description: "Lower uplift, higher cost, mild churn drag.",
    values: {
      baselineRevenue: "100000",
      upliftPct: "4",
      bonusCost: "20000",
      churnPct: "-1"
    }
  },
  {
    label: "Expected",
    description: "Balanced assumptions for typical performance.",
    values: {
      baselineRevenue: "120000",
      upliftPct: "8",
      bonusCost: "15000",
      churnPct: "-2"
    }
  },
  {
    label: "Aggressive",
    description: "Higher uplift with efficient bonus spend.",
    values: {
      baselineRevenue: "180000",
      upliftPct: "14",
      bonusCost: "12000",
      churnPct: "1"
    }
  }
];

function toNumber(value: string): number {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Home() {
  const [inputs, setInputs] = useState<Inputs>(presets[1].values);

  const results = useMemo(() => {
    const baselineRevenue = toNumber(inputs.baselineRevenue);
    const upliftPct = toNumber(inputs.upliftPct);
    const bonusCost = toNumber(inputs.bonusCost);
    const churnPct = toNumber(inputs.churnPct);

    const upliftRevenue = (baselineRevenue * upliftPct) / 100;
    const churnImpact = (baselineRevenue * churnPct) / 100;
    const netImpact = upliftRevenue + churnImpact - bonusCost;
    const roi = bonusCost > 0 ? (netImpact / bonusCost) * 100 : 0;
    const payback = upliftRevenue + churnImpact > 0
      ? bonusCost / (upliftRevenue + churnImpact)
      : 0;

    return {
      baselineRevenue,
      upliftRevenue,
      churnImpact,
      bonusCost,
      netImpact,
      roi,
      payback
    };
  }, [inputs]);

  const sensitivity = useMemo(() => {
    const baselineRevenue = toNumber(inputs.baselineRevenue);
    const bonusCost = toNumber(inputs.bonusCost);
    const churnPct = toNumber(inputs.churnPct);
    const baseUplift = toNumber(inputs.upliftPct);

    const deltas = [-6, -3, 0, 3, 6];
    return deltas.map((delta) => {
      const upliftPct = baseUplift + delta;
      const upliftRevenue = (baselineRevenue * upliftPct) / 100;
      const churnImpact = (baselineRevenue * churnPct) / 100;
      const netImpact = upliftRevenue + churnImpact - bonusCost;
      const roi = bonusCost > 0 ? (netImpact / bonusCost) * 100 : 0;
      return {
        label: `${upliftPct.toFixed(0)}%`,
        roi
      };
    });
  }, [inputs]);

  const maxAbsRoi = Math.max(
    10,
    ...sensitivity.map((point) => Math.abs(point.roi))
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-14">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Micro Project 1
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
          Promo ROI Calculator
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Estimate the impact of a marketing promotion by modeling uplift,
          churn effects, and direct bonus cost. Built for fast decision-making
          and easy iteration.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Scenario Presets</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start with a preset, then fine-tune the assumptions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setInputs(preset.values)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
          {presets.map((preset) => (
            <div key={`${preset.label}-desc`} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {preset.label}
              </p>
              <p className="mt-2 text-sm text-slate-600">{preset.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Inputs</h2>
          <p className="mt-1 text-sm text-slate-500">
            Adjust the assumptions to reflect your promo scenario.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="flex items-center gap-2">
                Baseline monthly revenue
                <span className="relative inline-flex">
                  <span className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500">
                    ?
                    <span className="pointer-events-none absolute left-1/2 top-7 w-56 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                      Your typical monthly revenue before the promo.
                    </span>
                  </span>
                </span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                value={inputs.baselineRevenue}
                onChange={(event) =>
                  setInputs((prev) => ({
                    ...prev,
                    baselineRevenue: event.target.value
                  }))
                }
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="flex items-center gap-2">
                Expected uplift (%)
                <span className="relative inline-flex">
                  <span className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500">
                    ?
                    <span className="pointer-events-none absolute left-1/2 top-7 w-56 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                      Expected % lift in revenue attributed to the promo.
                    </span>
                  </span>
                </span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                value={inputs.upliftPct}
                onChange={(event) =>
                  setInputs((prev) => ({
                    ...prev,
                    upliftPct: event.target.value
                  }))
                }
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="flex items-center gap-2">
                Bonus cost (total)
                <span className="relative inline-flex">
                  <span className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500">
                    ?
                    <span className="pointer-events-none absolute left-1/2 top-7 w-56 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                      Total promo cost (bonus, free bets, rewards).
                    </span>
                  </span>
                </span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                value={inputs.bonusCost}
                onChange={(event) =>
                  setInputs((prev) => ({
                    ...prev,
                    bonusCost: event.target.value
                  }))
                }
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="flex items-center gap-2">
                Churn impact (%)
                <span className="relative inline-flex">
                  <span className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500">
                    ?
                    <span className="pointer-events-none absolute left-1/2 top-7 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                      Promo effect on churn. Negative reduces revenue, positive improves retention.
                    </span>
                  </span>
                </span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                value={inputs.churnPct}
                onChange={(event) =>
                  setInputs((prev) => ({
                    ...prev,
                    churnPct: event.target.value
                  }))
                }
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <h2 className="text-lg font-semibold">ROI Snapshot</h2>
          <p className="mt-1 text-sm text-slate-300">
            High-level impact based on your inputs.
          </p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                Net Impact
                <span className="relative inline-flex">
                  <span className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-[11px] font-semibold text-slate-300">
                    ?
                    <span className="pointer-events-none absolute left-1/2 top-7 w-56 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                      Uplift revenue + churn impact - bonus cost.
                    </span>
                  </span>
                </span>
              </p>
              <p className="mt-2 text-2xl font-semibold">
                ${results.netImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-800/70 p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  ROI
                  <span className="relative inline-flex">
                    <span className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-[11px] font-semibold text-slate-300">
                      ?
                      <span className="pointer-events-none absolute left-1/2 top-7 w-48 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                        Net impact divided by bonus cost.
                      </span>
                    </span>
                  </span>
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {results.bonusCost > 0 ? results.roi.toFixed(1) : "0.0"}%
                </p>
              </div>
              <div className="rounded-2xl bg-slate-800/70 p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Payback (months)
                  <span className="relative inline-flex">
                    <span className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-[11px] font-semibold text-slate-300">
                      ?
                      <span className="pointer-events-none absolute left-1/2 top-7 w-64 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                        Months of uplift needed to cover the bonus cost.
                      </span>
                    </span>
                  </span>
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {results.upliftRevenue + results.churnImpact > 0
                    ? results.payback.toFixed(2)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Breakdown
          </h3>
          <dl className="mt-4 grid gap-3 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <dt>Baseline revenue</dt>
              <dd className="font-medium text-slate-900">
                ${results.baselineRevenue.toLocaleString()}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Uplift revenue</dt>
              <dd className="font-medium text-slate-900">
                ${results.upliftRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Churn impact</dt>
              <dd className="font-medium text-slate-900">
                ${results.churnImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Bonus cost</dt>
              <dd className="font-medium text-slate-900">
                ${results.bonusCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            ROI Sensitivity (Uplift ± 6%)
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            How ROI changes when uplift assumptions shift.
          </p>
          <div className="mt-5 flex items-end gap-4">
            {sensitivity.map((point) => {
              const height = Math.round((Math.abs(point.roi) / maxAbsRoi) * 140);
              const isNegative = point.roi < 0;
              return (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-xs font-medium text-slate-700">
                    {point.roi.toFixed(0)}%
                  </div>
                  <div className="relative flex h-40 w-full items-end">
                    <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200" />
                    <div
                      className={`mx-auto w-8 rounded-lg ${
                        isNegative ? "bg-rose-400" : "bg-emerald-500"
                      }`}
                      style={{ height: `${Math.max(6, height)}px` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500">{point.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Assumptions
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Baseline revenue represents a stable monthly run-rate.</li>
            <li>Uplift is attributable to the promo alone.</li>
            <li>Churn impact can be negative or positive.</li>
            <li>Bonus cost is fully accounted for in the month.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
