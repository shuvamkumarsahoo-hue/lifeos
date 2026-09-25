import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, BarChart3, Bell, BookOpen, Check, ChevronRight, CircleDollarSign,
  ClipboardList, Clock3, FileText, Flame, Goal, LayoutDashboard, Moon,
  CalendarDays, Play, Pause, RotateCcw, ArrowUpRight,
  Plus, Search, Settings, Sparkles, Sun, Target, Trash2, Wallet, X
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import "./styles.css";

const initialTasks = [
  { id: 1, title: "Finish DSA assignment", priority: "High", done: false },
  { id: 2, title: "Review Java inheritance", priority: "Medium", done: true },
  { id: 3, title: "30 min reading", priority: "Low", done: false }
];

const initialHabits = [
  { id: 1, name: "Workout", days: [1,1,1,0,1,1,0] },
  { id: 2, name: "Read", days: [1,1,1,1,0,1,1] },
  { id: 3, name: "Drink water", days: [1,1,1,1,1,1,1] },
  { id: 4, name: "Meditation", days: [1,0,1,1,0,1,0] }
];

const chartData = [
  { day: "Mon", hours: 2.5 }, { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 1.8 }, { day: "Thu", hours: 4.1 },
  { day: "Fri", hours: 3.4 }, { day: "Sat", hours: 2.8 },
  { day: "Sun", hours: 4.6 }
];

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function App() {
  const [page, setPage] = useState("Overview");
  const [dark, setDark] = useState(load("lifeos-theme", true));
  const [tasks, setTasks] = useState(load("lifeos-tasks", initialTasks));
  const [habits, setHabits] = useState(load("lifeos-habits", initialHabits));
  const [notes, setNotes] = useState(load("lifeos-notes", []));
  const [goals, setGoals] = useState(load("lifeos-goals", [
    { id: 1, name: "Learn React", progress: 80 },
    { id: 2, name: "Build portfolio", progress: 55 },
    { id: 3, name: "Get internship", progress: 30 }
  ]));
  const [expenses, setExpenses] = useState(load("lifeos-expenses", [
    { id: 1, title: "Food", amount: 2400 },
    { id: 2, title: "Transport", amount: 1200 },
    { id: 3, title: "Shopping", amount: 1850 },
    { id: 4, title: "Entertainment", amount: 1870 }
  ]));
  const [showAddTask, setShowAddTask] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);

  useEffect(() => localStorage.setItem("lifeos-theme", JSON.stringify(dark)), [dark]);
  useEffect(() => localStorage.setItem("lifeos-tasks", JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem("lifeos-habits", JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem("lifeos-notes", JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem("lifeos-goals", JSON.stringify(goals)), [goals]);
  useEffect(() => localStorage.setItem("lifeos-expenses", JSON.stringify(expenses)), [expenses]);

  const completed = tasks.filter(t => t.done).length;
  const taskPercent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const habitPercent = Math.round(
    habits.reduce((a,h) => a + h.days.reduce((x,y)=>x+y,0),0) /
    Math.max(1, habits.length * 7) * 100
  );
  const lifeScore = Math.round(taskPercent * .35 + habitPercent * .35 + 80 * .3);
  const totalExpenses = expenses.reduce((a,e)=>a+Number(e.amount),0);

  useEffect(() => {
    if (!focusRunning) return;
    const timer = setInterval(() => {
      setFocusSeconds(s => {
        if (s <= 1) { setFocusRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [focusRunning]);

  const nav = [
    ["Overview", LayoutDashboard], ["Study", BookOpen], ["Tasks", ClipboardList],
    ["Goals", Target], ["Habits", Flame], ["Finance", Wallet], ["Notes", FileText], ["Calendar", CalendarDays]
  ];

  function addTask(title, priority) {
    if (!title.trim()) return;
    setTasks(t => [{ id: Date.now(), title, priority, done:false }, ...t]);
    setShowAddTask(false);
  }

  function toggleHabit(id, index) {
    setHabits(h => h.map(x => x.id === id ? {...x, days:x.days.map((v,i)=>i===index?Number(!v):v)} : x));
  }

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Sparkles size={18}/></div><span>LIFEOS</span></div>
        <div className="nav">
          {nav.map(([name, Icon]) => (
            <button key={name} className={page===name ? "nav-item active" : "nav-item"} onClick={()=>setPage(name)}>
              <Icon size={18}/><span>{name}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={18}/><span>Settings</span></button>
          <div className="mini-profile"><div className="avatar">S</div><div><b>Shuvam</b><small>Personal OS</small></div></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="crumb">PERSONAL OPERATING SYSTEM</div>
            <h1>{page}</h1>
          </div>
          <div className="top-actions">
            <button className="icon-btn" onClick={()=>setDark(!dark)}>{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>
            <button className="icon-btn"><Bell size={19}/></button>
            <div className="avatar large">S</div>
          </div>
        </header>

        {page === "Overview" && <Dashboard lifeScore={lifeScore} taskPercent={taskPercent} habitPercent={habitPercent} tasks={tasks} setTasks={setTasks} habits={habits} toggleHabit={toggleHabit} chartData={chartData} setShowAddTask={setShowAddTask} totalExpenses={totalExpenses} focusSeconds={focusSeconds} setFocusSeconds={setFocusSeconds} focusRunning={focusRunning} setFocusRunning={setFocusRunning}/>}
        {page === "Tasks" && <Tasks tasks={tasks} setTasks={setTasks} setShowAddTask={setShowAddTask}/>}
        {page === "Habits" && <Habits habits={habits} toggleHabit={toggleHabit}/>}
        {page === "Goals" && <Goals goals={goals} setGoals={setGoals}/>}
        {page === "Study" && <Study chartData={chartData}/>}
        {page === "Finance" && <Finance expenses={expenses} setExpenses={setExpenses} total={totalExpenses}/>}
        {page === "Notes" && <Notes notes={notes} setNotes={setNotes}/>}
        {page === "Calendar" && <CalendarPage/>}

        {showAddTask && <AddTaskModal onClose={()=>setShowAddTask(false)} onAdd={addTask}/>}
      </main>
    </div>
  );
}

function Dashboard({lifeScore, taskPercent, habitPercent, tasks, setTasks, habits, toggleHabit, chartData, setShowAddTask, totalExpenses, focusSeconds, setFocusSeconds, focusRunning, setFocusRunning}) {
  return <section>
    <div className="hero">
      <div><p className="eyebrow">FRIDAY, SEPTEMBER 25</p><h2>Good morning, Shuvam <span>👋</span></h2><p className="muted">Here's your life at a glance. Keep the momentum going.</p></div>
      <div className="score"><div className="score-ring"><b>{lifeScore}</b><span>life score</span></div><div><b className="score-title">You're on track</b><p className="muted">Small wins compound.</p></div></div>
    </div>

    <div className="today-command">
      <div className="today-main">
        <div className="today-heading"><div><p className="eyebrow">TODAY'S COMMAND CENTER</p><h3>Make today count.</h3></div><span className="live-pill"><span></span> LIVE</span></div>
        <div className="today-progress"><div className="today-progress-head"><span>Daily progress</span><b>{taskPercent}%</b></div><div className="progress"><span style={{width:`${taskPercent}%`}}/></div></div>
        <div className="today-priorities">
          {tasks.slice(0,3).map(t=><div className="priority-item" key={t.id}><button className={t.done?"check checked":"check"} onClick={()=>setTasks(x=>x.map(a=>a.id===t.id?{...a,done:!a.done}:a))}>{t.done&&<Check size={13}/>}</button><span className={t.done?"task-done":""}>{t.title}</span><ArrowUpRight size={14}/></div>)}
        </div>
      </div>
      <div className="focus-card">
        <div className="focus-top"><span><Clock3 size={15}/> Focus session</span><button onClick={()=>{setFocusSeconds(25*60);setFocusRunning(false)}}><RotateCcw size={14}/></button></div>
        <div className="timer">{String(Math.floor(focusSeconds/60)).padStart(2,"0")}:{String(focusSeconds%60).padStart(2,"0")}</div>
        <p className="muted">25-minute deep work</p>
        <button className="primary full" onClick={()=>setFocusRunning(!focusRunning)}>{focusRunning?<><Pause size={16}/> Pause</>:<><Play size={16}/> Start focus</>}</button>
      </div>
    </div>

    <div className="stats">
      <Stat icon={<ClipboardList/>} value={tasks.filter(t=>!t.done).length} label="Tasks left" trend={`${taskPercent}% complete`}/>
      <Stat icon={<Flame/>} value="7" label="Day streak" trend="Keep it alive"/>
      <Stat icon={<Activity/>} value={`${habitPercent}%`} label="Habit score" trend="This week"/>
      <Stat icon={<Clock3/>} value="22.4h" label="Focus time" trend="+12% this week"/>
    </div>

    <div className="grid-two">
      <Card title="Today's schedule" action="View calendar">
        <div className="timeline">
          <TimeItem time="09:00" title="Classes" meta="Main campus"/>
          <TimeItem time="17:00" title="Gym" meta="45 min"/>
          <TimeItem time="19:00" title="Deep study" meta="DSA + Java"/>
          <TimeItem time="22:00" title="Wind down" meta="No screens"/>
        </div>
      </Card>
      <Card title="Habits" action="View all">
        {habits.slice(0,4).map(h=><div className="habit-row" key={h.id}>
          <span>{h.name}</span><div className="dots">{h.days.map((v,i)=><button key={i} className={v?"dot done":"dot"} onClick={()=>toggleHabit(h.id,i)}>{v?<Check size={11}/>: ""}</button>)}</div>
        </div>)}
        <div className="week-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
      </Card>
    </div>

    <div className="grid-two">
      <Card title="Focus this week" action="Study">
        <div className="chart-wrap"><ResponsiveContainer width="100%" height={210}><AreaChart data={chartData}>
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopOpacity=".35"/><stop offset="100%" stopOpacity="0"/></linearGradient></defs>
          <XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} width={28}/>
          <Tooltip contentStyle={{borderRadius:12,border:"1px solid var(--border)",background:"var(--card)"}}/>
          <Area type="monotone" dataKey="hours" stroke="var(--accent)" fill="url(#g)" strokeWidth={3}/>
        </AreaChart></ResponsiveContainer></div>
      </Card>
      <Card title="Quick tasks" action="Add task" onAction={()=>setShowAddTask(true)}>
        {tasks.slice(0,4).map(t=><div className="task-row" key={t.id}>
          <button className={t.done?"check checked":"check"} onClick={()=>setTasks(x=>x.map(a=>a.id===t.id?{...a,done:!a.done}:a))}>{t.done&&<Check size={13}/>}</button>
          <span className={t.done?"task-done":""}>{t.title}</span><span className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</span>
        </div>)}
      </Card>
    </div>

    <div className="upcoming-strip">
      <div><CalendarDays size={19}/><div><b>Upcoming</b><p>Stay ahead of what's next.</p></div></div>
      <div className="upcoming-items"><span><b>Tomorrow</b> Java revision</span><span><b>Friday</b> DSA test</span><span><b>Sunday</b> Portfolio build</span></div>
    </div>

    <div className="insight"><Sparkles size={19}/><div><b>LifeOS insight</b><p>You have ₹{totalExpenses.toLocaleString()} in tracked expenses this month. Your habit consistency is at {habitPercent}%.</p></div><ChevronRight size={18}/></div>
  </section>
}

function Stat({icon,value,label,trend}){return <div className="stat"><div className="stat-icon">{icon}</div><div><b>{value}</b><span>{label}</span><small>{trend}</small></div></div>}
function Card({title,action,children,onAction}){return <div className="card"><div className="card-head"><h3>{title}</h3>{action&&<button className="text-btn" onClick={onAction}>{action}<ChevronRight size={14}/></button>}</div>{children}</div>}
function TimeItem({time,title,meta}){return <div className="time-item"><span className="time">{time}</span><div><b>{title}</b><small>{meta}</small></div></div>}

function Tasks({tasks,setTasks,setShowAddTask}){return <section><div className="page-head"><div><h2>Tasks</h2><p className="muted">Everything you need to get done.</p></div><button className="primary" onClick={()=>setShowAddTask(true)}><Plus size={17}/> Add task</button></div><div className="task-list card">{tasks.map(t=><div className="task-row big" key={t.id}><button className={t.done?"check checked":"check"} onClick={()=>setTasks(x=>x.map(a=>a.id===t.id?{...a,done:!a.done}:a))}>{t.done&&<Check size={13}/>}</button><div className="grow"><b className={t.done?"task-done":""}>{t.title}</b><small>Personal task</small></div><span className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</span><button className="icon-btn small" onClick={()=>setTasks(x=>x.filter(a=>a.id!==t.id))}><Trash2 size={16}/></button></div>)}</div></section>}

function Habits({habits,toggleHabit}){return <section><div className="page-head"><div><h2>Habits</h2><p className="muted">Build consistency one day at a time.</p></div></div><div className="habit-grid">{habits.map(h=>{const p=Math.round(h.days.reduce((a,b)=>a+b,0)/7*100);return <div className="card habit-card" key={h.id}><div className="habit-title"><span>{h.name}</span><b>{p}%</b></div><div className="progress"><span style={{width:`${p}%`}}/></div><div className="big-dots">{h.days.map((v,i)=><button key={i} className={v?"dot done":"dot"} onClick={()=>toggleHabit(h.id,i)}>{v?<Check size={12}/>:i+1}</button>)}</div><small className="muted">Tap a day to toggle</small></div>})}</div></section>}

function Goals({goals,setGoals}){const update=(id,val)=>setGoals(g=>g.map(x=>x.id===id?{...x,progress:Math.max(0,Math.min(100,val))}:x));return <section><div className="page-head"><div><h2>Goals</h2><p className="muted">Turn plans into measurable progress.</p></div></div><div className="goal-grid">{goals.map(g=><div className="card goal-card" key={g.id}><div className="goal-top"><div className="goal-icon"><Goal size={19}/></div><b>{g.progress}%</b></div><h3>{g.name}</h3><div className="progress"><span style={{width:`${g.progress}%`}}/></div><div className="goal-actions"><button onClick={()=>update(g.id,g.progress-10)}>−</button><button onClick={()=>update(g.id,g.progress+10)}>+10%</button></div></div>)}</div></section>}

function Study({chartData}){return <section><div className="page-head"><div><h2>Study</h2><p className="muted">Your learning dashboard.</p></div><button className="primary"><Clock3 size={17}/> Start focus</button></div><div className="stats"><Stat icon={<BookOpen/>} value="78%" label="Overall progress" trend="+8% this month"/><Stat icon={<Clock3/>} value="22.4h" label="Focus time" trend="This week"/><Stat icon={<Target/>} value="4" label="Active subjects" trend="2 exams soon"/></div><div className="grid-two"><Card title="Subject progress"><Subject n="DSA" p={82}/><Subject n="Java" p={65}/><Subject n="Maths" p={72}/><Subject n="AI / ML" p={88}/></Card><Card title="Focus hours"><div className="chart-wrap"><ResponsiveContainer width="100%" height={250}><AreaChart data={chartData}><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="hours" stroke="var(--accent)" fill="none" strokeWidth={3}/></AreaChart></ResponsiveContainer></div></Card></div></section>}
function Subject({n,p}){return <div className="subject"><div><span>{n}</span><b>{p}%</b></div><div className="progress"><span style={{width:`${p}%`}}/></div></div>}

function Finance({expenses,setExpenses,total}){const [name,setName]=useState("");const [amount,setAmount]=useState("");const add=()=>{if(!name||!amount)return;setExpenses(e=>[...e,{id:Date.now(),title:name,amount:Number(amount)}]);setName("");setAmount("")};return <section><div className="page-head"><div><h2>Finance</h2><p className="muted">Keep your money visible.</p></div></div><div className="finance-hero card"><div><small>MONTHLY EXPENSES</small><h2>₹{total.toLocaleString()}</h2><p className="muted">Tracked spending</p></div><CircleDollarSign size={52}/></div><div className="card"><div className="card-head"><h3>Expenses</h3></div>{expenses.map(e=><div className="expense" key={e.id}><span>{e.title}</span><b>₹{Number(e.amount).toLocaleString()}</b><button className="icon-btn small" onClick={()=>setExpenses(x=>x.filter(a=>a.id!==e.id))}><Trash2 size={15}/></button></div>)}<div className="add-expense"><input placeholder="Expense name" value={name} onChange={e=>setName(e.target.value)}/><input type="number" placeholder="₹ Amount" value={amount} onChange={e=>setAmount(e.target.value)}/><button className="primary" onClick={add}>Add</button></div></div></section>}

function Notes({notes,setNotes}){const [text,setText]=useState("");const add=()=>{if(!text.trim())return;setNotes(n=>[{id:Date.now(),text, date:new Date().toLocaleDateString()},...n]);setText("")};return <section><div className="page-head"><div><h2>Notes</h2><p className="muted">Capture ideas before they disappear.</p></div></div><div className="note-compose card"><textarea placeholder="Write a quick note..." value={text} onChange={e=>setText(e.target.value)}/><button className="primary" onClick={add}><Plus size={17}/> Save note</button></div><div className="notes-grid">{notes.map(n=><div className="card note" key={n.id}><div><FileText size={18}/><small>{n.date}</small></div><p>{n.text}</p><button className="icon-btn small" onClick={()=>setNotes(x=>x.filter(a=>a.id!==n.id))}><Trash2 size={15}/></button></div>)}</div></section>}

function CalendarPage(){
  const days=[
    ["29","Mon",["Java revision","Gym"]],["30","Tue",["DSA practice"]],["01","Wed",["Maths","Deep study"]],["02","Thu",["AI / ML"]],["03","Fri",["DSA test"]],["04","Sat",["Portfolio"]],["05","Sun",["Plan next week"]]
  ];
  return <section><div className="page-head"><div><h2>Calendar</h2><p className="muted">Your week, organized at a glance.</p></div><button className="primary"><Plus size={17}/> Add event</button></div><div className="calendar-grid">{days.map(([date,day,items])=><div className="card calendar-day" key={date}><div className="calendar-date"><span>{day}</span><b>{date}</b></div>{items.map((x,i)=><div className={i===0?"calendar-event accent":"calendar-event"} key={x}><span></span>{x}</div>)}<div className="calendar-add"><Plus size={13}/> Add</div></div>)}</div><div className="card calendar-note"><CalendarDays size={18}/><div><b>Plan tomorrow tonight</b><p className="muted">A quick 5-minute planning habit can keep your priorities visible.</p></div></div></section>
}

function AddTaskModal({onClose,onAdd}){const [title,setTitle]=useState("");const [priority,setPriority]=useState("Medium");return <div className="overlay"><div className="modal"><div className="modal-head"><h3>Add task</h3><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><input autoFocus placeholder="What needs to be done?" value={title} onChange={e=>setTitle(e.target.value)}/><div className="priority-picker">{["Low","Medium","High"].map(p=><button key={p} className={priority===p?"selected":""} onClick={()=>setPriority(p)}>{p}</button>)}</div><button className="primary full" onClick={()=>onAdd(title,priority)}>Add task</button></div></div>}

createRoot(document.getElementById("root")).render(<App />);
