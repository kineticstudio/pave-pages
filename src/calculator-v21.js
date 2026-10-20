/* Matt's v21 value calculator, exactly: the formulas, defaults and resets of
   docs/calculator-source/pavevaluecalculator_v21_4questions_28.html, with
   every number read from calculator-data.json so Pave edits them in one
   place. Unlike calculator-model.js (design 05), compensation is never
   rounded: the defaults are the source benchmarks to the dollar, so the
   totals match Matt's to the cent. UMD, so scripts/check-calculator-v21.cjs
   runs the same code in Node. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PaveCalculatorV21 = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function create(data) {
    const B = data.benchmarks, A = data.assumptions, I = data.inputs;
    const band = (list, n) => list.find((b) => b.upTo === null || n <= b.upTo);
    const bucket = (headcount) => band(B.compBySize, headcount);
    const teamBenchmark = (headcount) =>
      clamp(Math.round(headcount / band(B.hrTeamRatio, headcount).employeesPerMember * 10) / 10, I.team.min, I.team.max);
    // null means "the benchmark for this company size", as in v21.
    const defaults = Object.freeze({ headcount: I.headcount.default, avgComp: null, precision: I.precision.default,
      team: null, productivity: I.productivity.default, outOfBand: I.outOfBand.default });

    function calculate(state) {
      const s = Object.assign({}, defaults, state);
      const headcount = s.headcount, size = bucket(headcount);
      const avgComp = s.avgComp === null ? size.comp : s.avgComp;
      const team = s.team === null ? teamBenchmark(headcount) : s.team;
      // Questions 3 and 4 need products that start at 200 employees.
      const eligible = headcount >= A.workflowMinimum;
      const spend = headcount * avgComp;
      const philosophy = spend * s.precision;
      const fte = team * s.productivity;
      const capacity = fte * B.analystCost;
      const outOfRangeEmployees = Math.round(headcount * s.outOfBand);
      const range = outOfRangeEmployees * A.outOfRangeCost;
      const merit = spend * A.meritPool * A.meritOverrun;
      const adherence = eligible ? capacity + range + merit : 0;
      const hires = Math.round(headcount * A.hiringRate);
      const acceptance = hires * A.replacementCost * A.acceptanceLift;
      const proactive = Math.round(headcount * A.proactiveRetention) * A.replacementCost;
      const clarity = Math.round(headcount * A.understandingRetention) * A.replacementCost;
      const understanding = eligible ? acceptance + proactive + clarity : 0;
      return Object.assign({}, s, { size, avgComp, team, teamBenchmark: teamBenchmark(headcount), eligible, spend,
        philosophy, fte, capacity, outOfRangeEmployees, range, merit, adherence, hires, acceptance, proactive,
        clarity, understanding, total: philosophy + adherence + understanding });
    }

    // Inputs as v21 takes them: any headcount resets the team to its
    // benchmark, and moving into another size band resets compensation to
    // that band's benchmark. Typed values are kept as typed (whole dollars,
    // tenths of a team member); the sliders step on their own.
    function set(state, key, value) {
      const spec = I[key];
      if (!spec || !Number.isFinite(value)) return state;
      const s = Object.assign({}, state);
      const v = clamp(value, spec.min, spec.max);
      if (key === 'headcount') {
        const next = Math.round(v);
        if (bucket(next) !== bucket(s.headcount)) s.avgComp = null;
        s.team = null;
        s.headcount = next;
      } else if (key === 'avgComp') s.avgComp = Math.round(v);
      else if (key === 'team') s.team = Math.round(v * 10) / 10;
      else s[key] = v;
      return s;
    }

    return Object.freeze({ data, defaults, bucket, teamBenchmark, calculate, set });
  }

  return Object.freeze({ create });
});
