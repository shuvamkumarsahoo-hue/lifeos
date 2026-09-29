import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  FileText,
  Flame,
  Goal,
  LayoutDashboard,
  Moon,
  CalendarDays,
  Play,
  Pause,
  RotateCcw,
  ArrowUpRight,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Wallet,
  X
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import "./styles.css";


const initialTasks = [
  {
    id: 1,
    title: "Finish DSA assignment",
    priority: "High",
    done: false
  },
  {
    id: 2,
    title: "Review Java inheritance",
    priority: "Medium",
    done: true
  },
  {
    id: 3,
    title: "30 min reading",
    priority: "Low",
    done: false
  }
];


const initialHabits = [
  {
    id: 1,
    name: "Workout",
    days: [1, 1, 1, 0, 1, 1, 0]
  },
  {
    id: 2,
    name: "Read",
    days: [1, 1, 1, 1, 0, 1, 1]
  },
  {
    id: 3,
    name: "Drink water",
    days: [1, 1, 1, 1, 1, 1, 1]
  },
  {
    id: 4,
    name: "Meditation",
    days: [1, 0, 1, 1, 0, 1, 0]
  }
];


const chartData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4.1 },
  { day: "Fri", hours: 3.4 },
  { day: "Sat", hours: 2.8 },
  { day: "Sun", hours: 4.6 }
];


function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}


function App() {

  /* =========================================
     SUPABASE AUTHENTICATION
  ========================================= */

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);


  /* =========================================
     LIFEOS STATE
  ========================================= */

  const [page, setPage] = useState("Overview");

  const [dark, setDark] = useState(
    load("lifeos-theme", true)
  );

  const [tasks, setTasks] = useState(
    load("lifeos-tasks", initialTasks)
  );

  const [habits, setHabits] = useState(
    load("lifeos-habits", initialHabits)
  );

  const [notes, setNotes] = useState(
    load("lifeos-notes", [])
  );

  const [goals, setGoals] = useState(
    load("lifeos-goals", [
      {
        id: 1,
        name: "Learn React",
        progress: 80
      },
      {
        id: 2,
        name: "Build portfolio",
        progress: 55
      },
      {
        id: 3,
        name: "Get internship",
        progress: 30
      }
    ])
  );

  const [expenses, setExpenses] = useState(
    load("lifeos-expenses", [
      {
        id: 1,
        title: "Food",
        amount: 2400
      },
      {
        id: 2,
        title: "Transport",
        amount: 1200
      },
      {
        id: 3,
        title: "Shopping",
        amount: 1850
      },
      {
        id: 4,
        title: "Entertainment",
        amount: 1870
      }
    ])
  );

  const [calendarEvents, setCalendarEvents] = useState(() => load("lifeos-calendar-events", [
    { id: 1, day: 0, title: "Java revision", tone: "purple" },
    { id: 2, day: 0, title: "Gym", tone: "blue" },
    { id: 3, day: 1, title: "DSA practice", tone: "blue" },
    { id: 4, day: 2, title: "Maths", tone: "purple" },
    { id: 5, day: 2, title: "Deep study", tone: "pink" },
    { id: 6, day: 3, title: "AI / ML", tone: "green" },
    { id: 7, day: 4, title: "DSA test", tone: "orange" },
    { id: 8, day: 5, title: "Portfolio", tone: "pink" },
    { id: 9, day: 6, title: "Plan next week", tone: "green" }
  ]));

  const [showAddTask, setShowAddTask] = useState(false);

  const [focusSeconds, setFocusSeconds] = useState(
    25 * 60
  );

  const [focusRunning, setFocusRunning] = useState(false);


  /* =========================================
     CHECK SUPABASE SESSION
  ========================================= */

  useEffect(() => {

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });


    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );


    return () => {
      subscription.unsubscribe();
    };

  }, []);


  /* =========================================
     LOCAL STORAGE
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      "lifeos-theme",
      JSON.stringify(dark)
    );
  }, [dark]);


  useEffect(() => {
    localStorage.setItem(
      "lifeos-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);


  useEffect(() => {
    localStorage.setItem(
      "lifeos-habits",
      JSON.stringify(habits)
    );
  }, [habits]);


  useEffect(() => {
    localStorage.setItem(
      "lifeos-notes",
      JSON.stringify(notes)
    );
  }, [notes]);


  useEffect(() => {
    localStorage.setItem(
      "lifeos-goals",
      JSON.stringify(goals)
    );
  }, [goals]);


  useEffect(() => {
    localStorage.setItem(
      "lifeos-expenses",
      JSON.stringify(expenses)
    );
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("lifeos-calendar-events", JSON.stringify(calendarEvents));
  }, [calendarEvents]);


  /* =========================================
     CALCULATIONS
  ========================================= */

  const completed = tasks.filter(
    t => t.done
  ).length;


  const taskPercent = tasks.length
    ? Math.round(
        completed / tasks.length * 100
      )
    : 0;


  const habitPercent = Math.round(
    habits.reduce(
      (a, h) =>
        a + h.days.reduce(
          (x, y) => x + y,
          0
        ),
      0
    ) /
      Math.max(
        1,
        habits.length * 7
      ) *
      100
  );


  const lifeScore = Math.round(
    taskPercent * 0.35 +
    habitPercent * 0.35 +
    80 * 0.3
  );


  const totalExpenses = expenses.reduce(
    (a, e) =>
      a + Number(e.amount),
    0
  );


  /* =========================================
     FOCUS TIMER
  ========================================= */

  useEffect(() => {

    if (!focusRunning) return;


    const timer = setInterval(() => {

      setFocusSeconds(s => {

        if (s <= 1) {
          setFocusRunning(false);
          return 0;
        }

        return s - 1;
      });

    }, 1000);


    return () =>
      clearInterval(timer);

  }, [focusRunning]);


  /* =========================================
     NAVIGATION
  ========================================= */

  const nav = [
    ["Overview", LayoutDashboard],
    ["Study", BookOpen],
    ["Tasks", ClipboardList],
    ["Goals", Target],
    ["Habits", Flame],
    ["Finance", Wallet],
    ["Notes", FileText],
    ["Calendar", CalendarDays]
  ];


  /* =========================================
     TASK FUNCTIONS
  ========================================= */

  function addTask(title, priority) {

    if (!title.trim()) return;

    setTasks(t => [
      {
        id: Date.now(),
        title,
        priority,
        done: false
      },
      ...t
    ]);

    setShowAddTask(false);
  }


  /* =========================================
     HABIT FUNCTIONS
  ========================================= */

  function toggleHabit(id, index) {

    setHabits(h =>
      h.map(x =>
        x.id === id
          ? {
              ...x,
              days: x.days.map(
                (v, i) =>
                  i === index
                    ? Number(!v)
                    : v
              )
            }
          : x
      )
    );
  }


  /* =========================================
     LOGOUT
  ========================================= */

  async function handleLogout() {

    await supabase.auth.signOut();

    setSession(null);
  }


  /* =========================================
     AUTH LOADING
  ========================================= */

  if (authLoading) {

    return (
      <div className="auth-loading">
        Loading LifeOS...
      </div>
    );
  }


  /* =========================================
     LOGIN SCREEN
  ========================================= */

  if (!session) {
    return <Auth />;
  }


  /* =========================================
     MAIN LIFEOS
  ========================================= */

  return (

    <div className={dark ? "app dark" : "app"}>

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            <Sparkles size={18} />
          </div>

          <span>LIFEOS</span>

        </div>


        <div className="nav">

          {nav.map(
            ([name, Icon]) => (

              <button
                key={name}
                className={
                  page === name
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage(name)
                }
              >

                <Icon size={18} />

                <span>{name}</span>

              </button>

            )
          )}

        </div>


        <div className="sidebar-bottom">

          <button className="nav-item">

            <Settings size={18} />

            <span>Settings</span>

          </button>


          <div className="mini-profile">

            <div className="avatar">
              S
            </div>

            <div>

              <b>
                {session.user?.user_metadata?.display_name ||
                  session.user?.email?.split("@")[0] ||
                  "User"}
              </b>

              <small>
                Personal OS
              </small>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            className="nav-item logout-btn"
            onClick={handleLogout}
          >

            <X size={18} />

            <span>Logout</span>

          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <div>

            <div className="crumb">
              PERSONAL OPERATING SYSTEM
            </div>

            <h1>{page}</h1>

          </div>


          <div className="top-actions">

            <button
              className="icon-btn"
              onClick={() =>
                setDark(!dark)
              }
            >

              {dark ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}

            </button>


            <button className="icon-btn">

              <Bell size={19} />

            </button>


            <div className="avatar large">
              S
            </div>

          </div>

        </header>


        {/* OVERVIEW */}

        {page === "Overview" && (

          <Dashboard
            lifeScore={lifeScore}
            taskPercent={taskPercent}
            habitPercent={habitPercent}
            tasks={tasks}
            setTasks={setTasks}
            habits={habits}
            toggleHabit={toggleHabit}
            chartData={chartData}
            setShowAddTask={
              setShowAddTask
            }
            totalExpenses={
              totalExpenses
            }
            focusSeconds={
              focusSeconds
            }
            setFocusSeconds={
              setFocusSeconds
            }
            focusRunning={
              focusRunning
            }
            setFocusRunning={
              setFocusRunning
            }
          />

        )}


        {/* TASKS */}

        {page === "Tasks" && (

          <Tasks
            tasks={tasks}
            setTasks={setTasks}
            setShowAddTask={
              setShowAddTask
            }
          />

        )}


        {/* HABITS */}

        {page === "Habits" && (

          <Habits
            habits={habits}
            setHabits={setHabits}
            toggleHabit={toggleHabit}
          />

        )}


        {/* GOALS */}

        {page === "Goals" && (

          <Goals
            goals={goals}
            setGoals={setGoals}
          />

        )}


        {/* STUDY */}

        {page === "Study" && (

          <Study
            chartData={chartData}
            focusSeconds={focusSeconds}
            setFocusSeconds={setFocusSeconds}
            focusRunning={focusRunning}
            setFocusRunning={setFocusRunning}
          />

        )}


        {/* FINANCE */}

        {page === "Finance" && (

          <Finance
            expenses={expenses}
            setExpenses={setExpenses}
            total={totalExpenses}
          />

        )}


        {/* NOTES */}

        {page === "Notes" && (

          <Notes
            notes={notes}
            setNotes={setNotes}
          />

        )}


        {/* CALENDAR */}

        {page === "Calendar" && (
          <CalendarPage events={calendarEvents} setEvents={setCalendarEvents} />
        )}


        {/* ADD TASK MODAL */}

        {showAddTask && (

          <AddTaskModal
            onClose={() =>
              setShowAddTask(false)
            }
            onAdd={addTask}
          />

        )}

      </main>

    </div>

  );
}


/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({
  lifeScore,
  taskPercent,
  habitPercent,
  tasks,
  setTasks,
  habits,
  toggleHabit,
  chartData,
  setShowAddTask,
  totalExpenses,
  focusSeconds,
  setFocusSeconds,
  focusRunning,
  setFocusRunning
}) {

  return (

    <section>

      <div className="hero">

        <div>

          <p className="eyebrow">
            FRIDAY, SEPTEMBER 25
          </p>

          <h2>
            Good morning, Shuvam{" "}
            <span>👋</span>
          </h2>

          <p className="muted">
            Here's your life at a glance.
            Keep the momentum going.
          </p>

        </div>


        <div className="score">

          <div className="score-ring">

            <b>{lifeScore}</b>

            <span>
              life score
            </span>

          </div>


          <div>

            <b className="score-title">
              You're on track
            </b>

            <p className="muted">
              Small wins compound.
            </p>

          </div>

        </div>

      </div>


      {/* TODAY COMMAND CENTER */}

      <div className="today-command">

        <div className="today-main">

          <div className="today-heading">

            <div>

              <p className="eyebrow">
                TODAY'S COMMAND CENTER
              </p>

              <h3>
                Make today count.
              </h3>

            </div>


            <span className="live-pill">

              <span></span>

              LIVE

            </span>

          </div>


          <div className="today-progress">

            <div className="today-progress-head">

              <span>
                Daily progress
              </span>

              <b>
                {taskPercent}%
              </b>

            </div>


            <div className="progress">

              <span
                style={{
                  width: `${taskPercent}%`
                }}
              />

            </div>

          </div>


          <div className="today-priorities">

            {tasks
              .slice(0, 3)
              .map(t => (

                <div
                  className="priority-item"
                  key={t.id}
                >

                  <button
                    className={
                      t.done
                        ? "check checked"
                        : "check"
                    }
                    onClick={() =>
                      setTasks(x =>
                        x.map(a =>
                          a.id === t.id
                            ? {
                                ...a,
                                done:
                                  !a.done
                              }
                            : a
                        )
                      )
                    }
                  >

                    {t.done && (
                      <Check size={13} />
                    )}

                  </button>


                  <span
                    className={
                      t.done
                        ? "task-done"
                        : ""
                    }
                  >
                    {t.title}
                  </span>


                  <ArrowUpRight
                    size={14}
                  />

                </div>

              ))}

          </div>

        </div>


        {/* FOCUS */}

        <div className="focus-card">

          <div className="focus-top">

            <span>

              <Clock3 size={15} />

              Focus session

            </span>


            <button
              onClick={() => {
                setFocusSeconds(
                  25 * 60
                );

                setFocusRunning(
                  false
                );
              }}
            >

              <RotateCcw size={14} />

            </button>

          </div>


          <div className="timer">

            {String(
              Math.floor(
                focusSeconds / 60
              )
            ).padStart(2, "0")}

            :

            {String(
              focusSeconds % 60
            ).padStart(2, "0")}

          </div>


          <p className="muted">
            25-minute deep work
          </p>


          <button
            className="primary full"
            onClick={() =>
              setFocusRunning(
                !focusRunning
              )
            }
          >

            {focusRunning ? (
              <>
                <Pause size={16} />
                Pause
              </>
            ) : (
              <>
                <Play size={16} />
                Start focus
              </>
            )}

          </button>

        </div>

      </div>


      {/* STATS */}

      <div className="stats">

        <Stat
          icon={<ClipboardList />}
          value={
            tasks.filter(
              t => !t.done
            ).length
          }
          label="Tasks left"
          trend={`${taskPercent}% complete`}
        />


        <Stat
          icon={<Flame />}
          value="7"
          label="Day streak"
          trend="Keep it alive"
        />


        <Stat
          icon={<Activity />}
          value={`${habitPercent}%`}
          label="Habit score"
          trend="This week"
        />


        <Stat
          icon={<Clock3 />}
          value="22.4h"
          label="Focus time"
          trend="+12% this week"
        />

      </div>


      {/* SCHEDULE + HABITS */}

      <div className="grid-two">

        <Card
          title="Today's schedule"
          action="View calendar"
        >

          <div className="timeline">

            <TimeItem
              time="09:00"
              title="Classes"
              meta="Main campus"
            />

            <TimeItem
              time="17:00"
              title="Gym"
              meta="45 min"
            />

            <TimeItem
              time="19:00"
              title="Deep study"
              meta="DSA + Java"
            />

            <TimeItem
              time="22:00"
              title="Wind down"
              meta="No screens"
            />

          </div>

        </Card>


        <Card
          title="Habits"
          action="View all"
        >

          {habits
            .slice(0, 4)
            .map(h => (

              <div
                className="habit-row"
                key={h.id}
              >

                <span>
                  {h.name}
                </span>


                <div className="dots">

                  {h.days.map(
                    (v, i) => (

                      <button
                        key={i}
                        className={
                          v
                            ? "dot done"
                            : "dot"
                        }
                        onClick={() =>
                          toggleHabit(
                            h.id,
                            i
                          )
                        }
                      >

                        {v ? (
                          <Check
                            size={11}
                          />
                        ) : (
                          ""
                        )}

                      </button>

                    )
                  )}

                </div>

              </div>

            ))}


          <div className="week-labels">

            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>

          </div>

        </Card>

      </div>


      {/* CHART + QUICK TASKS */}

      <div className="grid-two">

        <Card
          title="Focus this week"
          action="Study"
        >

          <div className="chart-wrap">

            <ResponsiveContainer
              width="100%"
              height={210}
            >

              <AreaChart
                data={chartData}
              >

                <defs>

                  <linearGradient
                    id="g"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopOpacity=".35"
                    />

                    <stop
                      offset="100%"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>


                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />


                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border:
                      "1px solid var(--border)",
                    background:
                      "var(--card)"
                  }}
                />


                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--accent)"
                  fill="url(#g)"
                  strokeWidth={3}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </Card>


        <Card
          title="Quick tasks"
          action="Add task"
          onAction={() =>
            setShowAddTask(true)
          }
        >

          {tasks
            .slice(0, 4)
            .map(t => (

              <div
                className="task-row"
                key={t.id}
              >

                <button
                  className={
                    t.done
                      ? "check checked"
                      : "check"
                  }
                  onClick={() =>
                    setTasks(x =>
                      x.map(a =>
                        a.id === t.id
                          ? {
                              ...a,
                              done:
                                !a.done
                            }
                          : a
                      )
                    )
                  }
                >

                  {t.done && (
                    <Check size={13} />
                  )}

                </button>


                <span
                  className={
                    t.done
                      ? "task-done"
                      : ""
                  }
                >
                  {t.title}
                </span>


                <span
                  className={`priority ${t.priority.toLowerCase()}`}
                >
                  {t.priority}
                </span>

              </div>

            ))}

        </Card>

      </div>


      {/* UPCOMING */}

      <div className="upcoming-strip">

        <div>

          <CalendarDays size={19} />

          <div>

            <b>Upcoming</b>

            <p>
              Stay ahead of what's next.
            </p>

          </div>

        </div>


        <div className="upcoming-items">

          <span>
            <b>Tomorrow</b>{" "}
            Java revision
          </span>

          <span>
            <b>Friday</b>{" "}
            DSA test
          </span>

          <span>
            <b>Sunday</b>{" "}
            Portfolio build
          </span>

        </div>

      </div>


      {/* INSIGHT */}

      <div className="insight">

        <Sparkles size={19} />

        <div>

          <b>LifeOS insight</b>

          <p>
            You have ₹
            {totalExpenses.toLocaleString()}
            {" "}in tracked expenses this month.
            Your habit consistency is at{" "}
            {habitPercent}%.
          </p>

        </div>

        <ChevronRight size={18} />

      </div>

    </section>
  );
}


/* =====================================================
   SMALL COMPONENTS
===================================================== */

function Stat({
  icon,
  value,
  label,
  trend
}) {

  return (

    <div className="stat">

      <div className="stat-icon">
        {icon}
      </div>

      <div>

        <b>{value}</b>

        <span>{label}</span>

        <small>{trend}</small>

      </div>

    </div>

  );
}


function Card({
  title,
  action,
  children,
  onAction
}) {

  return (

    <div className="card">

      <div className="card-head">

        <h3>{title}</h3>

        {action && (

          <button
            className="text-btn"
            onClick={onAction}
          >

            {action}

            <ChevronRight size={14} />

          </button>

        )}

      </div>

      {children}

    </div>

  );
}


function TimeItem({
  time,
  title,
  meta
}) {

  return (

    <div className="time-item">

      <span className="time">
        {time}
      </span>

      <div>

        <b>{title}</b>

        <small>{meta}</small>

      </div>

    </div>

  );
}


/* =====================================================
   TASKS
===================================================== */

function Tasks({ tasks, setTasks, setShowAddTask }) {
  const [editing, setEditing] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftPriority, setDraftPriority] = useState("Medium");

  const openEditor = task => {
    setEditing(task);
    setDraftTitle(task.title);
    setDraftPriority(task.priority);
  };

  const saveEdit = () => {
    if (!draftTitle.trim() || !editing) return;
    setTasks(list => list.map(t => t.id === editing.id
      ? { ...t, title: draftTitle.trim(), priority: draftPriority }
      : t
    ));
    setEditing(null);
  };

  const completed = tasks.filter(t => t.done).length;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;

  return (
    <section className="premium-page tasks-premium-page">
      <div className="page-head premium-page-head">
        <div>
          <p className="eyebrow">YOUR EXECUTION</p>
          <h2>Tasks</h2>
          <p className="muted">Turn today's priorities into finished work.</p>
        </div>
        <button className="primary premium-action" onClick={() => setShowAddTask(true)}>
          <Plus size={17}/> Add task
        </button>
      </div>

      <div className="tasks-command-grid">
        <div className="task-momentum-card">
          <div className="task-momentum-glow" />
          <div>
            <div className="premium-label"><Check size={14}/> TASK MOMENTUM</div>
            <strong>{percent}%</strong>
            <p>Completion across your task list</p>
            <div className="task-momentum-bar"><span style={{width:`${percent}%`}} /></div>
          </div>
          <div className="task-ring" style={{background:`conic-gradient(#8b5cf6 0 ${percent*3.6}deg, rgba(255,255,255,.08) ${percent*3.6}deg 360deg)`}}>
            <div><b>{completed}</b><span>done</span></div>
          </div>
        </div>
        <div className="task-mini-stat purple"><strong>{tasks.length}</strong><span>Total tasks</span><small>Everything in one place</small></div>
        <div className="task-mini-stat green"><strong>{completed}</strong><span>Completed</span><small>Keep the momentum</small></div>
      </div>

      <div className="premium-section-title"><div><h3>Today's tasks</h3><p>Complete, edit, or reprioritize whenever your day changes.</p></div><span>{tasks.length} items</span></div>

      <div className="task-premium-list">
        {tasks.length ? tasks.map((t,index) => (
          <div className={`task-premium-row ${t.done?'is-done':''}`} key={t.id} style={{animationDelay:`${index*45}ms`}}>
            <button className={t.done ? "check checked task-check" : "check task-check"} onClick={() => setTasks(x => x.map(a => a.id===t.id ? {...a,done:!a.done}:a))}>
              {t.done && <Check size={13}/>} 
            </button>
            <div className="task-premium-copy"><b>{t.title}</b><small>{t.done ? "Completed" : "Personal task"}</small></div>
            <span className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</span>
            <div className="task-row-actions">
              <button className="row-tool" onClick={()=>openEditor(t)}><Settings size={14}/> Edit</button>
              <button className="row-tool danger" onClick={()=>setTasks(x=>x.filter(a=>a.id!==t.id))}><Trash2 size={14}/> Delete</button>
            </div>
          </div>
        )) : (
          <div className="premium-empty"><div><Check size={26}/></div><h3>Nothing on your list.</h3><p>Add your next task and make it happen.</p><button className="primary" onClick={()=>setShowAddTask(true)}><Plus size={16}/> Add task</button></div>
        )}
      </div>

      {editing && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditing(null)}>
          <div className="modal premium-modal">
            <div className="modal-head"><div><p className="eyebrow">TASK EDITOR</p><h3>Edit task</h3></div><button className="icon-btn" onClick={()=>setEditing(null)}><X size={17}/></button></div>
            <label className="habit-form-label">Task name</label>
            <input autoFocus value={draftTitle} onChange={e=>setDraftTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&saveEdit()} />
            <label className="habit-form-label">Priority</label>
            <div className="priority-picker">{['Low','Medium','High'].map(p=><button key={p} className={draftPriority===p?'selected':''} onClick={()=>setDraftPriority(p)}>{p}</button>)}</div>
            <button className="primary full" onClick={saveEdit}><Check size={16}/> Save changes</button>
          </div>
        </div>
      )}
    </section>
  );
}


/* =====================================================
   HABITS
===================================================== */

function Habits({
  habits,
  setHabits,
  toggleHabit
}) {
  const [editing, setEditing] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftTarget, setDraftTarget] = useState(7);

  const todayIndex = (new Date().getDay() + 6) % 7;
  const labels = ["M", "T", "W", "T", "F", "S", "S"];

  const getStreak = days => {
    let streak = 0;
    for (let i = todayIndex; i >= 0; i--) {
      if (days[i]) streak++;
      else break;
    }
    return streak;
  };

  const getBestStreak = days => {
    let best = 0;
    let current = 0;
    days.forEach(v => {
      if (v) {
        current++;
        best = Math.max(best, current);
      } else current = 0;
    });
    return best;
  };

  const openEditor = habit => {
    setEditing(habit);
    setDraftName(habit.name);
    setDraftTarget(habit.target || 7);
  };

  const startNew = () => {
    setEditing("new");
    setDraftName("");
    setDraftTarget(7);
  };

  const saveHabit = () => {
    if (!draftName.trim()) return;
    if (editing === "new") {
      setHabits(h => [...h, {
        id: Date.now(),
        name: draftName.trim(),
        days: [0,0,0,0,0,0,0],
        target: Number(draftTarget)
      }]);
    } else {
      setHabits(h => h.map(x => x.id === editing.id
        ? { ...x, name: draftName.trim(), target: Number(draftTarget) }
        : x
      ));
    }
    setEditing(null);
  };

  const deleteHabit = id => setHabits(h => h.filter(x => x.id !== id));

  const totalChecks = habits.reduce((sum, h) => sum + h.days.reduce((a,b) => a+b, 0), 0);
  const average = habits.length ? Math.round((totalChecks / (habits.length * 7)) * 100) : 0;
  const completedToday = habits.filter(h => h.days[todayIndex]).length;
  const longestStreak = habits.length ? Math.max(...habits.map(h => getBestStreak(h.days))) : 0;
  const active = habits.filter(h => h.days.some(Boolean)).length;

  return (
    <section className="habits-page premium-page">
      <div className="page-head habits-head">
        <div>
          <p className="eyebrow">YOUR CONSISTENCY</p>
          <h2>Habits</h2>
          <p className="muted">Build consistency one day at a time.</p>
        </div>
        <button className="primary premium-action" onClick={startNew}>
          <Plus size={17} /> Add habit
        </button>
      </div>

      <div className="habit-overview premium-overview">
        <div className="habit-overview-card premium-hero-card">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="habit-overview-content">
            <div className="habit-overview-label"><Flame size={15} /> HABIT MOMENTUM</div>
            <strong>{average}%</strong>
            <p>Weekly consistency across your habits</p>
            <div className="habit-overview-bar"><span style={{width:`${average}%`}} /></div>
            <small className="hero-footnote">{completedToday} completed today · {active} active this week</small>
          </div>
          <div className="habit-overview-ring" style={{background:`conic-gradient(#a78bfa 0 ${average*3.6}deg, rgba(255,255,255,.08) ${average*3.6}deg 360deg)`}}>
            <div><b>{average}</b><span>%</span></div>
          </div>
        </div>

        <div className="habit-mini-stat stat-purple">
          <div className="stat-icon"><Target size={18}/></div>
          <strong>{habits.length}</strong><span>Total habits</span><small>Keep your routine clear</small>
        </div>
        <div className="habit-mini-stat stat-orange">
          <div className="stat-icon"><Flame size={18}/></div>
          <strong>{completedToday}</strong><span>Done today</span><small>Keep the streak alive</small>
        </div>
        <div className="habit-mini-stat stat-green">
          <div className="stat-icon"><Check size={18}/></div>
          <strong>{longestStreak}</strong><span>Best streak</span><small>Days in a row</small>
        </div>
      </div>

      <div className="habits-section-title premium-section-title">
        <div><h3>Your habits</h3><p>Tap a day to mark it complete. Edit your routine whenever it changes.</p></div>
        <span>{habits.length} habits</span>
      </div>

      {habits.length ? (
        <div className="habits-grid-new premium-grid">
          {habits.map((h,index) => {
            const checks = h.days.reduce((a,b)=>a+b,0);
            const p = Math.round((checks/7)*100);
            const target = h.target || 7;
            const targetProgress = Math.min(100, Math.round((checks/target)*100));
            const streak = getStreak(h.days);
            const best = getBestStreak(h.days);
            const accent = ['purple','blue','pink','green'][index % 4];
            return (
              <div className={`card habit-card-new premium-habit-card ${accent}`} key={h.id} style={{animationDelay:`${index*70}ms`}}>
                <div className="card-accent" />
                <div className="habit-card-top">
                  <div className="habit-title-new">
                    <div className="habit-icon-new"><Flame size={18}/></div>
                    <div><h3>{h.name}</h3><span>{target} days / week target</span></div>
                  </div>
                  <strong>{p}%</strong>
                </div>
                <div className="progress habit-progress-new"><span style={{width:`${p}%`}}/></div>
                <div className="habit-days-labels">
                  {labels.map((label,i)=><span key={i} className={i===todayIndex?'today':''}>{label}</span>)}
                </div>
                <div className="habit-dots-new">
                  {h.days.map((v,i)=>(
                    <button key={i} className={`dot ${v?'done':''} ${i===todayIndex?'today-dot':''}`} onClick={()=>toggleHabit(h.id,i)} aria-label={`${labels[i]} day`}>
                      {v ? <Check size={13}/> : ''}
                    </button>
                  ))}
                </div>
                <div className="habit-stats-row">
                  <span>🔥 Current <b>{streak}d</b></span>
                  <span>🏆 Best <b>{best}d</b></span>
                  <span>🎯 Target <b>{targetProgress}%</b></span>
                </div>
                <div className="habit-actions-new">
                  <button onClick={()=>openEditor(h)}><Settings size={14}/> Edit</button>
                  <button className="danger" onClick={()=>deleteHabit(h.id)}><Trash2 size={14}/> Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="habit-empty"><div><Target size={28}/></div><h3>Build your first habit.</h3><p>Add something small and make it consistent.</p><button className="primary" onClick={startNew}><Plus size={16}/> Add habit</button></div>
      )}

      {editing && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditing(null)}>
          <div className="modal habit-modal premium-modal">
            <div className="modal-head"><div><p className="eyebrow">HABIT EDITOR</p><h3>{editing==='new'?'Create habit':'Edit habit'}</h3></div><button className="icon-btn" onClick={()=>setEditing(null)}><X size={17}/></button></div>
            <label className="habit-form-label">Habit name</label>
            <input autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)} placeholder="e.g. DSA Practice" onKeyDown={e=>e.key==='Enter'&&saveHabit()}/>
            <label className="habit-form-label">Weekly target</label>
            <div className="target-picker">{[3,4,5,6,7].map(n=><button key={n} className={draftTarget===n?'selected':''} onClick={()=>setDraftTarget(n)}>{n} days</button>)}</div>
            <p className="muted habit-form-note">Your existing weekly check-ins stay exactly as they are.</p>
            <button className="primary full" onClick={saveHabit}><Check size={16}/> {editing==='new'?'Create habit':'Save changes'}</button>
          </div>
        </div>
      )}
    </section>
  );
}

/* =====================================================
   GOALS
===================================================== */

function Goals({ goals, setGoals }) {
  const [editing, setEditing] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftProgress, setDraftProgress] = useState(0);

  const update = (id,val) => setGoals(g => g.map(x => x.id===id ? {...x, progress:Math.max(0,Math.min(100,val))} : x));
  const startNew = () => { setEditing("new"); setDraftName(""); setDraftProgress(0); };
  const openEditor = g => { setEditing(g); setDraftName(g.name); setDraftProgress(g.progress); };
  const saveGoal = () => {
    if (!draftName.trim()) return;
    if (editing === "new") setGoals(g => [...g,{id:Date.now(),name:draftName.trim(),progress:Number(draftProgress)}]);
    else setGoals(g => g.map(x => x.id===editing.id ? {...x,name:draftName.trim(),progress:Number(draftProgress)} : x));
    setEditing(null);
  };
  const deleteGoal = id => setGoals(g => g.filter(x=>x.id!==id));

  const completed = goals.filter(g=>g.progress>=100).length;
  const active = goals.filter(g=>g.progress<100).length;
  const average = goals.length ? Math.round(goals.reduce((s,g)=>s+g.progress,0)/goals.length) : 0;

  const status = p => p>=100 ? ['Completed','completed'] : p>=75 ? ['Almost there','near'] : p>=40 ? ['In progress','progressing'] : ['Getting started','starting'];

  return (
    <section className="goals-page premium-page">
      <div className="page-head goals-head">
        <div><p className="eyebrow">YOUR DIRECTION</p><h2>Goals</h2><p className="muted">Turn ambitions into visible progress.</p></div>
        <button className="primary premium-action" onClick={startNew}><Plus size={17}/> Add goal</button>
      </div>

      <div className="goal-overview premium-overview">
        <div className="goal-hero-card premium-goal-hero">
          <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
          <div className="goal-hero-content">
            <div className="goal-hero-label"><Target size={15}/> GOAL MOMENTUM</div>
            <div className="goal-hero-number">{average}%</div>
            <p>Average progress across your goals</p>
            <div className="goal-hero-progress"><span style={{width:`${average}%`}}/></div>
            <small>{completed} completed · {active} still moving</small>
          </div>
          <div className="goal-hero-ring" style={{'--goal-progress':`${average*3.6}deg`}}><div><b>{average}</b><span>%</span></div></div>
        </div>
        <div className="goal-mini-stat purple"><div className="goal-mini-icon"><Target size={18}/></div><strong>{goals.length}</strong><span>Total goals</span><small>Keep your direction clear</small></div>
        <div className="goal-mini-stat orange"><div className="goal-mini-icon"><Flame size={18}/></div><strong>{active}</strong><span>Active goals</span><small>Small steps count</small></div>
        <div className="goal-mini-stat green"><div className="goal-mini-icon"><Check size={18}/></div><strong>{completed}</strong><span>Completed</span><small>Milestones reached</small></div>
      </div>

      <div className="goals-section-title premium-section-title"><div><h3>Your goals</h3><p>Push each one forward whenever you make progress.</p></div><span>{goals.length} goals</span></div>

      {goals.length ? (
        <div className="goal-grid goals-grid-new premium-grid">
          {goals.map((g,index)=>{
            const [label,cls]=status(g.progress);
            const accent=['purple','blue','pink','green'][index%4];
            return <div className={`card goal-card-new premium-goal-card ${accent} ${cls}`} key={g.id} style={{animationDelay:`${index*70}ms`}}>
              <div className="card-accent"/>
              <div className="goal-card-top"><div className="goal-icon-new"><Goal size={18}/></div><span className={`goal-status ${cls}`}><i/> {label}</span></div>
              <div className="goal-title-row"><h3>{g.name}</h3><strong>{g.progress}%</strong></div>
              <div className="goal-progress-new"><span style={{width:`${g.progress}%`}}/></div>
              <div className="goal-progress-meta"><span>0%</span><span>{g.progress>=100?'Goal complete 🎉':`${100-g.progress}% to go`}</span><span>100%</span></div>
              <div className="goal-actions-new">
                <button onClick={()=>update(g.id,g.progress-10)} aria-label="Decrease progress">−</button>
                <button className="goal-add-progress" onClick={()=>update(g.id,g.progress+10)}><Plus size={14}/> Add 10%</button>
                <button onClick={()=>update(g.id,100)} aria-label="Complete goal"><Check size={14}/></button>
              </div>
              <div className="goal-card-tools"><button onClick={()=>openEditor(g)}><Settings size={14}/> Edit</button><button className="danger" onClick={()=>deleteGoal(g.id)}><Trash2 size={14}/> Delete</button></div>
            </div>;
          })}
        </div>
      ) : <div className="goal-empty"><div><Target size={28}/></div><h3>Your next chapter starts here.</h3><p>Add a goal to start tracking meaningful progress.</p><button className="primary" onClick={startNew}><Plus size={16}/> Add goal</button></div>}

      {editing && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditing(null)}>
        <div className="modal goal-premium-modal">
          <div className="modal-head"><div><p className="eyebrow">GOAL EDITOR</p><h3>{editing==='new'?'Create goal':'Edit goal'}</h3></div><button className="icon-btn" onClick={()=>setEditing(null)}><X size={17}/></button></div>
          <label className="habit-form-label">Goal name</label><input autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)} placeholder="e.g. Become an AI Engineer" onKeyDown={e=>e.key==='Enter'&&saveGoal()}/>
          <div className="goal-edit-progress-row"><label className="habit-form-label">Progress</label><b>{draftProgress}%</b></div>
          <input className="goal-range" type="range" min="0" max="100" step="5" value={draftProgress} onChange={e=>setDraftProgress(Number(e.target.value))}/>
          <div className="goal-range-labels"><span>0%</span><span>50%</span><span>100%</span></div>
          <div className="goal-modal-actions"><button className="secondary-btn" onClick={()=>setEditing(null)}>Cancel</button><button className="primary" onClick={saveGoal}><Check size={16}/> {editing==='new'?'Create goal':'Save changes'}</button></div>
        </div>
      </div>}
    </section>
  );
}

/* =====================================================
   STUDY
===================================================== */

function Study({ chartData, focusSeconds, setFocusSeconds, focusRunning, setFocusRunning }) {
  const [subjects, setSubjects] = useState(() => load("lifeos-study-subjects", [
    {id:1,name:"DSA",progress:82},
    {id:2,name:"Java",progress:65},
    {id:3,name:"Maths",progress:72},
    {id:4,name:"AI / ML",progress:88}
  ]));
  const [editing, setEditing] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftProgress, setDraftProgress] = useState(0);

  useEffect(()=>localStorage.setItem("lifeos-study-subjects",JSON.stringify(subjects)),[subjects]);

  const average = subjects.length ? Math.round(subjects.reduce((s,x)=>s+x.progress,0)/subjects.length) : 0;
  const openEditor = subject => { setEditing(subject); setDraftName(subject.name); setDraftProgress(subject.progress); };
  const startNew = () => { setEditing("new"); setDraftName(""); setDraftProgress(0); };
  const saveSubject = () => {
    if (!draftName.trim()) return;
    if(editing==='new') setSubjects(s=>[...s,{id:Date.now(),name:draftName.trim(),progress:Number(draftProgress)}]);
    else setSubjects(s=>s.map(x=>x.id===editing.id?{...x,name:draftName.trim(),progress:Number(draftProgress)}:x));
    setEditing(null);
  };

  const toggleFocus = () => setFocusRunning(v=>!v);

  return (
    <section className="premium-page study-premium-page">
      <div className="page-head premium-page-head">
        <div><p className="eyebrow">YOUR LEARNING ENGINE</p><h2>Study</h2><p className="muted">Build knowledge with visible progress and focused sessions.</p></div>
        <button className="primary premium-action" onClick={toggleFocus}>{focusRunning?<Pause size={17}/>:<Play size={17}/>} {focusRunning?'Pause focus':'Start focus'}</button>
      </div>

      <div className="study-overview-grid">
        <div className="study-hero-card">
          <div className="study-hero-glow"/>
          <div><div className="premium-label"><BookOpen size={14}/> STUDY MOMENTUM</div><strong>{average}%</strong><p>Average progress across your subjects</p><div className="study-hero-bar"><span style={{width:`${average}%`}}/></div><small>{subjects.length} active subjects · {subjects.filter(s=>s.progress>=80).length} at 80%+</small></div>
          <div className="study-ring" style={{background:`conic-gradient(#38bdf8 0 ${average*3.6}deg, rgba(255,255,255,.08) ${average*3.6}deg 360deg)`}}><div><b>{average}</b><span>%</span></div></div>
        </div>
        <div className="study-mini-stat blue"><BookOpen size={18}/><strong>{subjects.length}</strong><span>Subjects</span><small>Keep your syllabus visible</small></div>
        <div className="study-mini-stat purple"><Clock3 size={18}/><strong>{Math.floor(focusSeconds/60)}m</strong><span>Focus timer</span><small>{focusRunning?'Session running':'Ready when you are'}</small></div>
        <div className="study-mini-stat green"><Target size={18}/><strong>{subjects.filter(s=>s.progress>=80).length}</strong><span>Strong subjects</span><small>80% or more progress</small></div>
      </div>

      <div className="premium-section-title"><div><h3>Your subjects</h3><p>Edit progress when your real study progress changes.</p></div><button className="premium-outline-btn" onClick={startNew}><Plus size={15}/> Add subject</button></div>

      <div className="study-content-grid">
        <div className="study-subject-grid">
          {subjects.map((s,index)=>{
            const accent=['purple','blue','pink','green'][index%4];
            return <div className={`study-subject-card ${accent}`} key={s.id}>
              <div className="card-accent"/><div className="study-subject-top"><div className="subject-icon"><BookOpen size={17}/></div><strong>{s.progress}%</strong></div>
              <h3>{s.name}</h3><div className="study-progress"><span style={{width:`${s.progress}%`}}/></div><div className="study-progress-meta"><span>Progress</span><span>{s.progress>=100?'Completed':`${100-s.progress}% to go`}</span></div>
              <div className="study-subject-tools"><button onClick={()=>openEditor(s)}><Settings size={14}/> Edit</button><button className="danger" onClick={()=>setSubjects(x=>x.filter(a=>a.id!==s.id))}><Trash2 size={14}/> Delete</button></div>
            </div>
          })}
        </div>
        <Card title="Focus hours">
          <div className="chart-wrap study-chart-wrap"><ResponsiveContainer width="100%" height={250}><AreaChart data={chartData}><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:12,border:'1px solid var(--border)',background:'var(--card)',color:'var(--text)'}}/><Area type="monotone" dataKey="hours" stroke="#8b5cf6" fill="url(#studyGradient)" strokeWidth={3}/><defs><linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity=".32"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient></defs></AreaChart></ResponsiveContainer></div>
          <div className="focus-timer-mini"><div><span>Focus session</span><b>{String(Math.floor(focusSeconds/60)).padStart(2,'0')}:{String(focusSeconds%60).padStart(2,'0')}</b></div><div className="focus-mini-actions"><button className="icon-btn small" onClick={()=>{setFocusRunning(false);setFocusSeconds(25*60)}} title="Reset timer"><RotateCcw size={14}/></button><button className="primary" onClick={toggleFocus}>{focusRunning?<Pause size={14}/>:<Play size={14}/>} {focusRunning?'Pause':'Start'}</button></div></div>
        </Card>
      </div>

      {editing && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditing(null)}><div className="modal premium-modal"><div className="modal-head"><div><p className="eyebrow">SUBJECT EDITOR</p><h3>{editing==='new'?'Add subject':'Edit subject'}</h3></div><button className="icon-btn" onClick={()=>setEditing(null)}><X size={17}/></button></div><label className="habit-form-label">Subject name</label><input autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&saveSubject()}/><div className="goal-edit-progress-row"><label className="habit-form-label">Progress</label><b>{draftProgress}%</b></div><input className="goal-range" type="range" min="0" max="100" step="5" value={draftProgress} onChange={e=>setDraftProgress(Number(e.target.value))}/><div className="goal-range-labels"><span>0%</span><span>50%</span><span>100%</span></div><button className="primary full" onClick={saveSubject}><Check size={16}/> {editing==='new'?'Add subject':'Save changes'}</button></div></div>}
    </section>
  );
}


/* =====================================================
   FINANCE
===================================================== */

function Finance({ expenses, setExpenses, total }) {
  const [name,setName]=useState(""); const [amount,setAmount]=useState("");
  const [editing,setEditing]=useState(null); const [draftName,setDraftName]=useState(""); const [draftAmount,setDraftAmount]=useState("");
  const add=()=>{if(!name.trim()||!amount)return;setExpenses(e=>[...e,{id:Date.now(),title:name.trim(),amount:Number(amount)}]);setName("");setAmount("");};
  const openEdit=e=>{setEditing(e);setDraftName(e.title);setDraftAmount(String(e.amount));};
  const saveEdit=()=>{if(!draftName.trim()||!draftAmount)return;setExpenses(x=>x.map(e=>e.id===editing.id?{...e,title:draftName.trim(),amount:Number(draftAmount)}:e));setEditing(null);};
  return <section className="premium-page finance-premium-page">
    <div className="page-head premium-page-head"><div><p className="eyebrow">YOUR MONEY</p><h2>Finance</h2><p className="muted">Keep spending visible, simple, and under control.</p></div></div>
    <div className="finance-premium-overview"><div className="finance-hero premium-finance-hero"><div><div className="premium-label"><Wallet size={14}/> MONTHLY EXPENSES</div><h2>₹{total.toLocaleString()}</h2><p>Tracked spending across your current entries</p></div><div className="finance-orb"><CircleDollarSign size={30}/></div></div><div className="finance-mini-stat"><Wallet size={18}/><strong>{expenses.length}</strong><span>Tracked entries</span><small>Every expense in one place</small></div><div className="finance-mini-stat green"><ArrowUpRight size={18}/><strong>₹{expenses.length?Math.round(total/expenses.length).toLocaleString():0}</strong><span>Average entry</span><small>Based on tracked spending</small></div></div>
    <div className="finance-content-grid"><div className="finance-expenses-panel"><div className="premium-section-title"><div><h3>Expenses</h3><p>Edit amounts whenever reality changes.</p></div><span>{expenses.length} entries</span></div><div className="expense-premium-list">{expenses.map((e,i)=><div className="expense-premium-row" key={e.id} style={{animationDelay:`${i*45}ms`}}><div className="expense-icon"><CircleDollarSign size={16}/></div><div className="expense-copy"><b>{e.title}</b><small>Tracked expense</small></div><strong>₹{Number(e.amount).toLocaleString()}</strong><button className="row-tool" onClick={()=>openEdit(e)}><Settings size={14}/> Edit</button><button className="row-tool danger" onClick={()=>setExpenses(x=>x.filter(a=>a.id!==e.id))}><Trash2 size={14}/></button></div>)}</div></div>
    <div className="finance-add-card"><div className="premium-label"><Plus size={14}/> ADD EXPENSE</div><h3>Track a new expense</h3><p className="muted">Keep the total accurate with every purchase.</p><input placeholder="Expense name" value={name} onChange={e=>setName(e.target.value)}/><input type="number" placeholder="₹ Amount" value={amount} onChange={e=>setAmount(e.target.value)}/><button className="primary full" onClick={add}><Plus size={16}/> Add expense</button></div></div>
    {editing&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditing(null)}><div className="modal premium-modal"><div className="modal-head"><div><p className="eyebrow">EXPENSE EDITOR</p><h3>Edit expense</h3></div><button className="icon-btn" onClick={()=>setEditing(null)}><X size={17}/></button></div><label className="habit-form-label">Expense name</label><input autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)}/><label className="habit-form-label">Amount</label><input type="number" value={draftAmount} onChange={e=>setDraftAmount(e.target.value)}/><button className="primary full" onClick={saveEdit}><Check size={16}/> Save changes</button></div></div>}
  </section>;
}


/* =====================================================
   NOTES
===================================================== */

function Notes({ notes, setNotes }) {
  const [text,setText]=useState(""); const [editing,setEditing]=useState(null); const [draft,setDraft]=useState("");
  const add=()=>{if(!text.trim())return;setNotes(n=>[{id:Date.now(),text:text.trim(),date:new Date().toLocaleDateString()},...n]);setText("");};
  const openEdit=n=>{setEditing(n);setDraft(n.text);};
  const saveEdit=()=>{if(!draft.trim())return;setNotes(x=>x.map(n=>n.id===editing.id?{...n,text:draft.trim()}:n));setEditing(null);};
  return <section className="premium-page notes-premium-page">
    <div className="page-head premium-page-head"><div><p className="eyebrow">YOUR SECOND BRAIN</p><h2>Notes</h2><p className="muted">Capture ideas, decisions, and things worth remembering.</p></div></div>
    <div className="notes-premium-compose"><div><div className="premium-label"><Sparkles size={14}/> QUICK CAPTURE</div><h3>Write it down.</h3><p className="muted">Your notes stay in LifeOS until you decide to remove them.</p></div><textarea placeholder="Write a quick note..." value={text} onChange={e=>setText(e.target.value)}/><button className="primary" onClick={add}><Plus size={16}/> Save note</button></div>
    <div className="premium-section-title"><div><h3>Your notes</h3><p>Edit or delete anything that changes.</p></div><span>{notes.length} notes</span></div>
    {notes.length?<div className="notes-premium-grid">{notes.map((n,i)=><article className="note-premium-card" key={n.id} style={{animationDelay:`${i*50}ms`}}><div className="note-premium-top"><div className="note-icon"><FileText size={17}/></div><small>{n.date}</small></div><p>{n.text}</p><div className="note-premium-actions"><button onClick={()=>openEdit(n)}><Settings size={14}/> Edit</button><button className="danger" onClick={()=>setNotes(x=>x.filter(a=>a.id!==n.id))}><Trash2 size={14}/> Delete</button></div></article>)}</div>:<div className="premium-empty"><div><FileText size={26}/></div><h3>Your second brain is empty.</h3><p>Capture your first idea above.</p></div>}
    {editing&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditing(null)}><div className="modal premium-modal"><div className="modal-head"><div><p className="eyebrow">NOTE EDITOR</p><h3>Edit note</h3></div><button className="icon-btn" onClick={()=>setEditing(null)}><X size={17}/></button></div><textarea className="note-edit-textarea" autoFocus value={draft} onChange={e=>setDraft(e.target.value)}/><button className="primary full" onClick={saveEdit}><Check size={16}/> Save changes</button></div></div>}
  </section>;
}


/* =====================================================
   CALENDAR
===================================================== */

function CalendarPage({ events, setEvents }) {
  const [showAdd, setShowAdd] = useState(false);
  const [draftDay, setDraftDay] = useState(0);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTone, setDraftTone] = useState("purple");

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const dates = ["29","30","01","02","03","04","05"];

  const addEvent = () => {
    if (!draftTitle.trim()) return;
    setEvents(list => [...list, { id: Date.now(), day: Number(draftDay), title: draftTitle.trim(), tone: draftTone }]);
    setDraftTitle("");
    setShowAdd(false);
  };

  const removeEvent = id => setEvents(list => list.filter(e => e.id !== id));

  return (
    <section className="premium-page calendar-premium-page">
      <div className="page-head premium-page-head">
        <div><p className="eyebrow">YOUR WEEK</p><h2>Calendar</h2><p className="muted">See your commitments and plans without the clutter.</p></div>
        <button className="primary premium-action" onClick={() => setShowAdd(true)}><Plus size={16}/> Add event</button>
      </div>

      <div className="calendar-premium-hero">
        <div><div className="premium-label"><CalendarDays size={14}/> WEEKLY RHYTHM</div><h3>Keep the important things visible.</h3><p>Plan study sessions, workouts, tests, and personal commitments in one calm view.</p></div>
        <div className="calendar-week-stat"><strong>{events.length}</strong><span>planned events</span></div>
      </div>

      <div className="calendar-grid calendar-grid-premium">
        {days.map((day, index) => {
          const items = events.filter(e => e.day === index);
          return <div className={`calendar-day calendar-day-premium ${index === 0 ? 'today' : ''}`} key={day}>
            <div className="calendar-date"><div><span>{day}</span><b>{dates[index]}</b></div><small>{index===0?'START':'DAY '+(index+1)}</small></div>
            <div className="calendar-events-list">
              {items.map(event => <div className={`calendar-event-premium ${event.tone || 'purple'}`} key={event.id}><span className="event-dot"/><span>{event.title}</span><button className="event-delete" onClick={() => removeEvent(event.id)} aria-label="Delete event"><X size={12}/></button></div>)}
              {!items.length && <div className="calendar-empty-day">Nothing planned</div>}
            </div>
            <button className="calendar-add-premium" onClick={() => { setDraftDay(index); setShowAdd(true); }}><Plus size={13}/> Add</button>
          </div>;
        })}
      </div>

      <div className="calendar-premium-note"><div className="note-icon"><Sparkles size={17}/></div><div><b>Plan tomorrow tonight</b><p>Keep tomorrow visible before you switch off for the day.</p></div></div>

      {showAdd && <div className="overlay" onMouseDown={e => e.target===e.currentTarget && setShowAdd(false)}><div className="modal premium-modal"><div className="modal-head"><div><p className="eyebrow">CALENDAR EDITOR</p><h3>Add event</h3></div><button className="icon-btn" onClick={() => setShowAdd(false)}><X size={17}/></button></div><label className="habit-form-label">Event</label><input autoFocus placeholder="e.g. DSA practice" value={draftTitle} onChange={e=>setDraftTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addEvent()}/><label className="habit-form-label">Day</label><select className="premium-select" value={draftDay} onChange={e=>setDraftDay(Number(e.target.value))}>{days.map((d,i)=><option value={i} key={d}>{d}</option>)}</select><label className="habit-form-label">Accent</label><div className="calendar-tone-picker">{['purple','blue','pink','green','orange'].map(t=><button key={t} className={draftTone===t?`tone-choice ${t} selected`:`tone-choice ${t}`} onClick={()=>setDraftTone(t)}><span/></button>)}</div><button className="primary full" onClick={addEvent}><Check size={16}/> Add event</button></div></div>}
    </section>
  );
}


/* =====================================================
   ADD TASK MODAL
===================================================== */

function AddTaskModal({
  onClose,
  onAdd
}) {

  const [title, setTitle] =
    useState("");

  const [priority, setPriority] =
    useState("Medium");


  return (

    <div className="overlay">

      <div className="modal">

        <div className="modal-head">

          <h3>
            Add task
          </h3>


          <button
            className="icon-btn"
            onClick={onClose}
          >

            <X size={18} />

          </button>

        </div>


        <input
          autoFocus
          placeholder="What needs to be done?"
          value={title}
          onChange={e =>
            setTitle(
              e.target.value
            )
          }
        />


        <div className="priority-picker">

          {[
            "Low",
            "Medium",
            "High"
          ].map(p => (

            <button
              key={p}
              className={
                priority === p
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setPriority(p)
              }
            >

              {p}

            </button>

          ))}

        </div>


        <button
          className="primary full"
          onClick={() =>
            onAdd(
              title,
              priority
            )
          }
        >

          Add task

        </button>

      </div>

    </div>

  );
}


/* =====================================================
   RENDER
===================================================== */

createRoot(
  document.getElementById("root")
).render(
  <App />
);