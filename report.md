# CSE513 Assignment 1: CPU Scheduling Simulator

Website: [https://aliskf.github.io/cpu-scheduling-simulator/](https://aliskf.github.io/cpu-scheduling-simulator/)

## 1. Overview
This report documents a browser-based CPU scheduling simulator implementing FCFS, SJF (non-preemptive), SRTF (preemptive) and Round Robin. Context switching is zero, each process has one CPU burst and no I/O.

## 2. Hand calculations and simulator comparison

### 2.1 Workload A

Input:

| Process | Arrival | Burst |
|---|---|---|
| P1 | 0 | 8 |
| P2 | 1 | 4 |
| P3 | 2 | 2 |
| P4 | 4 | 1 |

#### FCFS - Workload A
Timeline: P1 0-8, P2 8-12, P3 12-14, P4 14-15.

| Process | Arrival | Burst | First start | Completion | Turnaround | Waiting | Response |
|---|---|---|---|---|---|---|---|
| P1 | 0 | 8 | 0 | 8 | 8 | 0 | 0 |
| P2 | 1 | 4 | 8 | 12 | 11 | 7 | 7 |
| P3 | 2 | 2 | 12 | 14 | 12 | 10 | 10 |
| P4 | 4 | 1 | 14 | 15 | 11 | 10 | 10 |

Averages: turnaround 10.50, waiting 6.75, response 6.75. Simulator output matches.

#### SJF - Workload A
Timeline: P1 0-8, P4 8-9, P3 9-11, P2 11-15.

| Process | Arrival | Burst | First start | Completion | Turnaround | Waiting | Response |
|---|---|---|---|---|---|---|---|
| P1 | 0 | 8 | 0 | 8 | 8 | 0 | 0 |
| P2 | 1 | 4 | 11 | 15 | 14 | 10 | 10 |
| P3 | 2 | 2 | 9 | 11 | 9 | 7 | 7 |
| P4 | 4 | 1 | 8 | 9 | 5 | 4 | 4 |

Averages: turnaround 9.00, waiting 5.25, response 5.25. Simulator output matches.

#### SRTF - Workload A
Timeline: P1 0-1, P2 1-2, P3 2-4, P4 4-5, P2 5-8, P1 8-15.

| Process | Arrival | Burst | First start | Completion | Turnaround | Waiting | Response |
|---|---|---|---|---|---|---|---|
| P1 | 0 | 8 | 0 | 15 | 15 | 7 | 0 |
| P2 | 1 | 4 | 1 | 8 | 7 | 3 | 0 |
| P3 | 2 | 2 | 2 | 4 | 2 | 0 | 0 |
| P4 | 4 | 1 | 4 | 5 | 1 | 0 | 0 |

Averages: turnaround 6.25, waiting 2.50, response 0.00. Simulator output matches.

#### RR (q=2) - Workload A
Timeline: P1 0-2, P2 2-4, P3 4-6, P1 6-8, P4 8-9, P2 9-11, P1 11-13, P1 13-15.

| Process | Arrival | Burst | First start | Completion | Turnaround | Waiting | Response |
|---|---|---|---|---|---|---|---|
| P1 | 0 | 8 | 0 | 15 | 15 | 7 | 0 |
| P2 | 1 | 4 | 2 | 11 | 10 | 6 | 1 |
| P3 | 2 | 2 | 4 | 6 | 4 | 2 | 2 |
| P4 | 4 | 1 | 8 | 9 | 5 | 4 | 4 |

Averages: turnaround 8.50, waiting 4.75, response 1.75. Simulator output matches.

### 2.2 Workload B

Input:

| Process | Arrival | Burst |
|---|---|---|
| P1 | 2 | 3 |
| P2 | 2 | 1 |
| P3 | 8 | 2 |
| P4 | 9 | 1 |

#### FCFS - Workload B
Timeline: Idle 0-2, P1 2-5, P2 5-6, Idle 6-8, P3 8-10, P4 10-11.

| Process | Arrival | Burst | First start | Completion | Turnaround | Waiting | Response |
|---|---|---|---|---|---|---|---|
| P1 | 2 | 3 | 2 | 5 | 3 | 0 | 0 |
| P2 | 2 | 1 | 5 | 6 | 4 | 3 | 3 |
| P3 | 8 | 2 | 8 | 10 | 2 | 0 | 0 |
| P4 | 9 | 1 | 10 | 11 | 2 | 1 | 1 |

Averages: turnaround 2.75, waiting 1.00, response 1.00. Simulator output matches.

#### SJF - Workload B
Timeline: Idle 0-2, P2 2-3, P1 3-6, Idle 6-8, P3 8-10, P4 10-11.

| Process | Arrival | Burst | First start | Completion | Turnaround | Waiting | Response |
|---|---|---|---|---|---|---|---|
| P1 | 2 | 3 | 3 | 6 | 4 | 1 | 1 |
| P2 | 2 | 1 | 2 | 3 | 1 | 0 | 0 |
| P3 | 8 | 2 | 8 | 10 | 2 | 0 | 0 |
| P4 | 9 | 1 | 10 | 11 | 2 | 1 | 1 |

Averages: turnaround 2.25, waiting 0.50, response 0.50. Simulator output matches.

#### SRTF - Workload B
Timeline: Idle 0-2, P2 2-3, P1 3-6, Idle 6-8, P3 8-10, P4 10-11.

| Process | Arrival | Burst | First start | Completion | Turnaround | Waiting | Response |
|---|---|---|---|---|---|---|---|
| P1 | 2 | 3 | 3 | 6 | 4 | 1 | 1 |
| P2 | 2 | 1 | 2 | 3 | 1 | 0 | 0 |
| P3 | 8 | 2 | 8 | 10 | 2 | 0 | 0 |
| P4 | 9 | 1 | 10 | 11 | 2 | 1 | 1 |

Averages: turnaround 2.25, waiting 0.50, response 0.50. Simulator output matches.

#### RR (q=2) - Workload B
Timeline: Idle 0-2, P1 2-4, P2 4-5, P1 5-6, Idle 6-8, P3 8-10, P4 10-11.

| Process | Arrival | Burst | First start | Completion | Turnaround | Waiting | Response |
|---|---|---|---|---|---|---|---|
| P1 | 2 | 3 | 2 | 6 | 4 | 1 | 0 |
| P2 | 2 | 1 | 4 | 5 | 3 | 2 | 2 |
| P3 | 8 | 2 | 8 | 10 | 2 | 0 | 0 |
| P4 | 9 | 1 | 10 | 11 | 2 | 1 | 1 |

Averages: turnaround 2.75, waiting 1.00, response 0.75. Simulator output matches.

No discrepancies were found between hand calculations and simulator output.

## 3. Additional test cases

### Test 1 - CPU idle time
Processes: P1 arrival 0 burst 3; P2 arrival 5 burst 2.
Expected timeline: P1 0-3, Idle 3-5, P2 5-7 (all algorithms, since no overlap). Metrics: P1 TAT 3 WT 0 RT 0; P2 TAT 2 WT 0 RT 0. Verified by simulator.

### Test 2 - Simultaneous arrivals and tie
Processes: P1 arrival 0 burst 4; P2 arrival 0 burst 4; P3 arrival 0 burst 2.
FCFS: P1 0-4, P2 4-8, P3 8-10. SJF/SRTF: P3 0-2, P1 2-6, P2 6-10. RR (q=2): P1 0-2, P2 2-4, P3 4-6, P1 6-8, P2 8-10. Verifies tie-breaking by input order and simultaneous arrival handling. Simulator matches.

### Test 3 - SRTF preemption
Processes: P1 arrival 0 burst 5; P2 arrival 2 burst 2.
SRTF: P1 0-2, P2 2-4, P1 4-7. Verifies preemption when a shorter remaining time arrives. Simulator matches.

### Verification properties
- Every process receives exactly its specified CPU burst (sum of its Gantt slices equals burst).
- No process runs before its arrival.
- Processes do not overlap on the single CPU.
- Waiting and response times are nonnegative.
- CPU is never idle while a process is ready.

## 4. Analysis

1. For Workload A, SRTF gives the lowest average waiting time (2.50) and the lowest average response time (0.00). SRTF preempts the long P1 as soon as shorter jobs arrive, so P2, P3, P4 finish early. FCFS runs P1 to completion first, delaying all short jobs, giving the highest waiting/response times.

2. For Workload A, RR with q=1 gives avg waiting 4.75 and avg response 0.75; q=2 gives 4.75 and 1.75; q=4 gives 5.50 and 3.75. A smaller quantum improves response time (jobs start their first slice sooner) but increases context switches and can delay completion of long jobs, so waiting/turnaround do not always improve; q=1 and q=2 have the same average waiting here, while q=4 is worse.

3. SJF and SRTF produce the same schedule when no preemption is needed, for example when all processes arrive at time 0, or when arrivals are spaced so that no shorter job arrives while a longer one is running. Example: processes with bursts 2, 4, 6 all arriving at time 0; both run them in increasing burst order.

4. A real OS cannot know future CPU bursts; the simulator is given exact bursts as input. Real systems estimate bursts (e.g., exponential averaging of past bursts) to approximate SJF/SRTF.

5. Starvation can occur under SJF/SRTF if new short jobs keep arriving, because a long job may never become the shortest. In this assignment workloads are finite, so once arrivals stop the long job eventually runs.

6. One implementation mistake: initially the SRTF selection used <= when comparing remaining times, preempting on ties. This caused unnecessary switches. A test with two processes having equal remaining time exposed it; changing to strict < fixed it.

## 5. AI assistance
- Tools used: browser-based testing and manual hand calculations for verification; a small amount of AI assistance for initial HTML/CSS scaffolding and debugging.
- Generated code and explanations were checked against hand-calculated timelines and metrics for Workloads A and B and the three test cases.
- One suggestion rejected: an AI suggestion to merge consecutive Round Robin slices of the same process into one block was rejected, because quantum boundaries must remain visible.

## 6. README
See README.md in the source archive for running instructions, dependencies, and limitations.
