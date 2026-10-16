# CPU Scheduling Simulator

Browser-based simulator for CPU scheduling: FCFS, SJF (non-preemptive), SRTF (preemptive), and Round Robin.

## Run locally
Open `index.html` in any modern browser. No build step, no dependencies.

## Files
- `index.html` - UI
- `styles.css` - styling
- `app.js` - scheduling logic

## Notes
- Context switch time is zero.
- Each process has one CPU burst and no I/O.
- Arrival times must be nonnegative integers; bursts and quantum positive integers; PIDs unique.

## Limitations
- Workloads with very large total CPU time render many Gantt cells but remain correct.
- No persistence; refresh resets data.
