const procBody = document.getElementById('procBody');
const errorBox = document.getElementById('error');
const results = document.getElementById('results');

let processes = []; // {id, arrival, burst}

function showError(msg) { errorBox.textContent = msg; errorBox.hidden = !msg; }
function clearError() { errorBox.hidden = true; errorBox.textContent = ''; }

function renderTable() {
  procBody.innerHTML = '';
  processes.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input data-i="${i}" data-f="id" value="${esc(p.id)}"></td>
      <td><input data-i="${i}" data-f="arrival" type="number" value="${p.arrival}"></td>
      <td><input data-i="${i}" data-f="burst" type="number" value="${p.burst}"></td>
      <td><button class="removeBtn" data-i="${i}">Remove</button></td>
    `;
    procBody.appendChild(tr);
  });
  procBody.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', e => {
      const i = +e.target.dataset.i;
      const f = e.target.dataset.f;
      if (f === 'id') processes[i].id = e.target.value.trim();
      else if (f === 'arrival') processes[i].arrival = +e.target.value;
      else if (f === 'burst') processes[i].burst = +e.target.value;
    });
  });
  procBody.querySelectorAll('.removeBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      processes.splice(+e.target.dataset.i, 1);
      renderTable();
    });
  });
}

function esc(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

document.getElementById('addBtn').addEventListener('click', () => {
  processes.push({ id: 'P' + (processes.length + 1), arrival: 0, burst: 1 });
  renderTable();
});
document.getElementById('clearBtn').addEventListener('click', () => { processes = []; renderTable(); results.hidden = true; });

document.getElementById('loadA').addEventListener('click', () => {
  processes = [
    {id:'P1', arrival:0, burst:8},
    {id:'P2', arrival:1, burst:4},
    {id:'P3', arrival:2, burst:2},
    {id:'P4', arrival:4, burst:1},
  ];
  renderTable();
});
document.getElementById('loadB').addEventListener('click', () => {
  processes = [
    {id:'P1', arrival:2, burst:3},
    {id:'P2', arrival:2, burst:1},
    {id:'P3', arrival:8, burst:2},
    {id:'P4', arrival:9, burst:1},
  ];
  renderTable();
});

function validate() {
  if (processes.length === 0) return 'No processes.';
  const ids = processes.map(p => p.id);
  if (ids.some(id => !id)) return 'Process ID cannot be empty.';
  if (new Set(ids).size !== ids.length) return 'Process IDs must be unique.';
  for (const p of processes) {
    if (!Number.isInteger(p.arrival) || p.arrival < 0) return `Invalid arrival time for ${p.id}.`;
    if (!Number.isInteger(p.burst) || p.burst <= 0) return `Invalid CPU burst for ${p.id}.`;
  }
  const algo = document.getElementById('algo').value;
  if (algo === 'RR') {
    const q = +document.getElementById('quantum').value;
    if (!Number.isInteger(q) || q <= 0) return 'Time quantum must be a positive integer.';
  }
  return null;
}

// Simulation functions return {gantt:[{start,end,pidIndex}], completion:[], firstStart:[]}
function simulate(processes, algo, quantum) {
  const n = processes.length;
  const arrival = processes.map(p => p.arrival);
  const burst = processes.map(p => p.burst);
  const remaining = burst.slice();
  const firstStart = Array(n).fill(null);
  const completion = Array(n).fill(null);
  let completedCount = 0;
  const gantt = [];

  if (algo === 'FCFS') {
    // sort by arrival then input index
    const order = processes.map((_,i)=>i).sort((a,b)=> arrival[a]-arrival[b] || a-b);
    let t = 0;
    for (const i of order) {
      if (t < arrival[i]) { gantt.push({start:t, end:arrival[i], pid:-1}); t = arrival[i]; }
      if (firstStart[i] === null) firstStart[i] = t;
      gantt.push({start:t, end:t+burst[i], pid:i});
      t += burst[i];
      completion[i] = t;
      completedCount++;
    }
  } else if (algo === 'SJF') {
    let t = 0;
    while (completedCount < n) {
      const cands = [];
      for (let i=0;i<n;i++) if (completion[i]===null && arrival[i]<=t && remaining[i]>0) cands.push(i);
      if (cands.length === 0) {
        const nextArr = Math.min(...Array.from({length:n},(_,i)=>completion[i]===null?arrival[i]:Infinity));
        if (nextArr === Infinity) break;
        if (nextArr > t) { gantt.push({start:t, end:nextArr, pid:-1}); }
        t = nextArr;
        continue;
      }
      // shortest burst, then arrival, then input index
      cands.sort((a,b)=> remaining[a]-remaining[b] || arrival[a]-arrival[b] || a-b);
      const i = cands[0];
      if (firstStart[i] === null) firstStart[i] = t;
      gantt.push({start:t, end:t+remaining[i], pid:i});
      t += remaining[i];
      remaining[i] = 0;
      completion[i] = t;
      completedCount++;
    }
  } else if (algo === 'SRTF') {
    let t = 0;
    let running = null;
    // unit simulation
    const slots = []; // {start,end,pid}
    while (completedCount < n) {
      // if running finished
      if (running !== null && remaining[running] === 0) {
        completion[running] = t;
        completedCount++;
        running = null;
      }
      if (running === null) {
        const cands = [];
        for (let i=0;i<n;i++) if (completion[i]===null && arrival[i]<=t && remaining[i]>0) cands.push(i);
        if (cands.length === 0) {
          const nextArr = Math.min(...Array.from({length:n},(_,i)=>completion[i]===null?arrival[i]:Infinity));
          if (nextArr === Infinity) break;
          if (nextArr > t) slots.push({start:t, end:nextArr, pid:-1});
          t = nextArr;
          continue;
        }
        cands.sort((a,b)=> remaining[a]-remaining[b] || arrival[a]-arrival[b] || a-b);
        running = cands[0];
        if (firstStart[running] === null) firstStart[running] = t;
      } else {
        // check preemption: if another has strictly shorter remaining
        const cands = [];
        for (let i=0;i<n;i++) if (i!==running && completion[i]===null && arrival[i]<=t && remaining[i]>0) cands.push(i);
        if (cands.length) {
          cands.sort((a,b)=> remaining[a]-remaining[b] || arrival[a]-arrival[b] || a-b);
          if (remaining[cands[0]] < remaining[running]) {
            running = cands[0];
            if (firstStart[running] === null) firstStart[running] = t;
          }
        }
      }
      // run one unit
      slots.push({start:t, end:t+1, pid:running});
      remaining[running] -= 1;
      t += 1;
    }
    // finalize last running if completed
    if (running !== null && remaining[running] === 0 && completion[running] === null) {
      completion[running] = t;
      completedCount++;
    }
    // compress slots
    for (const s of slots) {
      const last = gantt[gantt.length-1];
      if (last && last.pid === s.pid && last.end === s.start) {
        last.end = s.end;
      } else {
        gantt.push({start:s.start, end:s.end, pid:s.pid});
      }
    }
  } else if (algo === 'RR') {
    let t = 0;
    let running = null;
    const readyQueue = [];
    const enqueueArrivals = (upTo) => {
      // enqueue uncompleted processes with arrival in (last?, upTo] not already queued/running
      // We'll enqueue those with arrival <= upTo and remaining>0 and not completed and not in queue/running
      const toAdd = [];
      for (let i=0;i<n;i++) {
        if (completion[i] !== null) continue;
        if (remaining[i] <= 0) continue;
        if (i === running) continue;
        if (readyQueue.includes(i)) continue;
        if (arrival[i] <= upTo) {
          // only those not yet enqueued; but we may have missed earlier? We'll enqueue all with arrival<=upTo not queued
          toAdd.push(i);
        }
      }
      // sort by arrival then input index for stable order
      toAdd.sort((a,b)=> arrival[a]-arrival[b] || a-b);
      // But to avoid re-adding old ones, filter by a "queuedFlag"
      // Use a flag array
    };
    // Better use a queued flag
    const queued = Array(n).fill(false);
    const enqueueByArrival = (limit) => {
      const toAdd = [];
      for (let i=0;i<n;i++) {
        if (completion[i] !== null) continue;
        if (remaining[i] <= 0) continue;
        if (i === running) continue;
        if (queued[i]) continue;
        if (arrival[i] <= limit) {
          toAdd.push(i);
        }
      }
      toAdd.sort((a,b)=> arrival[a]-arrival[b] || a-b);
      for (const i of toAdd) { readyQueue.push(i); queued[i] = true; }
    };

    while (completedCount < n) {
      enqueueByArrival(t);
      if (running === null) {
        if (readyQueue.length > 0) {
          running = readyQueue.shift();
          queued[running] = false;
          if (firstStart[running] === null) firstStart[running] = t;
        } else {
          const nextArr = Math.min(...Array.from({length:n},(_,i)=>completion[i]===null && remaining[i]>0 ? arrival[i] : Infinity));
          if (nextArr === Infinity) break;
          if (nextArr > t) gantt.push({start:t, end:nextArr, pid:-1});
          t = nextArr;
          continue;
        }
      }
      const sliceLen = Math.min(quantum, remaining[running]);
      const start = t;
      const end = t + sliceLen;
      gantt.push({start:start, end:end, pid:running});
      remaining[running] -= sliceLen;
      t = end;
      if (remaining[running] === 0) {
        completion[running] = t;
        completedCount++;
        running = null;
      } else {
        // enqueue arrivals during (start, t]
        enqueueByArrival(t);
        // re-enqueue running
        readyQueue.push(running);
        queued[running] = true;
        running = null;
      }
    }
  }

  // compute metrics
  const metrics = processes.map((p,i) => ({
    id: p.id,
    arrival: p.arrival,
    burst: p.burst,
    firstStart: firstStart[i],
    completion: completion[i],
    turnaround: completion[i] - p.arrival,
    waiting: (completion[i] - p.arrival) - p.burst,
    response: firstStart[i] - p.arrival,
  }));

  return { gantt, firstStart, completion, metrics };
}

function run() {
  clearError();
  const err = validate();
  if (err) { showError(err); return; }
  const algo = document.getElementById('algo').value;
  const quantum = +document.getElementById('quantum').value;
  const res = simulate(processes, algo, quantum);

  // render gantt
  const ganttEl = document.getElementById('gantt');
  ganttEl.innerHTML = '';
  const total = res.gantt.length ? res.gantt[res.gantt.length-1].end : 0;
  res.gantt.forEach(seg => {
    const div = document.createElement('div');
    const dur = seg.end - seg.start;
    div.className = 'gantt-seg ' + (seg.pid === -1 ? 'idle' : 'p' + (seg.pid % 6));
    div.style.flex = dur + ' 0 0';
    div.textContent = seg.pid === -1 ? 'Idle' : processes[seg.pid].id;
    div.title = (seg.pid===-1?'Idle':processes[seg.pid].id) + ' ' + seg.start + '-' + seg.end;
    ganttEl.appendChild(div);
  });

  // metrics table
  const body = document.getElementById('metricsBody');
  body.innerHTML = '';
  for (const m of res.metrics) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${esc(m.id)}</td><td>${m.arrival}</td><td>${m.burst}</td><td>${m.firstStart}</td><td>${m.completion}</td><td>${m.turnaround}</td><td>${m.waiting}</td><td>${m.response}</td>`;
    body.appendChild(tr);
  }
  const avgT = res.metrics.reduce((a,m)=>a+m.turnaround,0)/res.metrics.length;
  const avgW = res.metrics.reduce((a,m)=>a+m.waiting,0)/res.metrics.length;
  const avgR = res.metrics.reduce((a,m)=>a+m.response,0)/res.metrics.length;
  document.getElementById('averages').textContent = `Average turnaround: ${avgT.toFixed(2)} | Average waiting: ${avgW.toFixed(2)} | Average response: ${avgR.toFixed(2)}`;
  document.getElementById('summary').textContent = `Algorithm: ${algo}${algo==='RR'?' (q='+quantum+')':''} | Total time: ${total}`;
  document.getElementById('ganttHint').textContent = 'Each block shows process (or idle) for its time interval. Hover for exact times.';
  results.hidden = false;
}

document.getElementById('runBtn').addEventListener('click', run);
renderTable();
