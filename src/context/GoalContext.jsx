import { createContext, useContext, useEffect, useState } from "react";

const GoalContext = createContext();

const getToday = () => new Date().toISOString().split("T")[0];

const isSameDay = (d1, d2) => d1 === d2;

const isYesterday = (date) => {
  const d = new Date(date);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return d.toDateString() === y.toDateString();
};

export function GoalProvider({ children }) {

  const [goals, setGoals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("goals")) || [];
    } catch {
      return [];
    }
  });

  const [userStats, setUserStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("stats")) || {
        xpTotal: 0,
        streak: 0,
        lastLogDate: null,
        completedCount: 0
      };
    } catch {
      return {
        xpTotal: 0,
        streak: 0,
        lastLogDate: null,
        completedCount: 0
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(userStats));
  }, [userStats]);

  function createGoal(data) {
    const target = parseInt(data.target);

    if (!data.title || !data.category) {
      throw new Error("Invalid goal data");
    }

    if (isNaN(target) || target <= 0) {
      throw new Error("Target must be a positive number");
    }

    const newGoal = {
      id: Date.now().toString(),
      title: data.title,
      category: data.category,
      type: data.type,
      target,
      progress: 0,
      status: "active",
      startDate: data.startDate,
      endDate: data.endDate || null,
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setGoals(prev => [...prev, newGoal]);
  }

  function deleteGoal(id) {
    setGoals(prev => prev.filter(g => g.id !== id));
  }

  function updateGoal(id, data) {
    setGoals(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, ...data, updatedAt: new Date().toISOString() }
          : g
      )
    );
  }

  function togglePause(id) {
    setGoals(prev =>
      prev.map(g =>
        g.id === id
          ? {
              ...g,
              status: g.status === "paused" ? "active" : "paused"
            }
          : g
      )
    );
  }

  function addProgress(id, amount = 1) {

    const today = getToday();

    let xpGained = 0;
    let completedNow = false;
    let didLogToday = false;

    setGoals(prev =>
      prev.map(goal => {

        if (goal.id !== id) return goal;
        if (goal.status === "paused" || goal.status === "completed") return goal;

        const logs = goal.logs || [];

        const alreadyLoggedToday = logs.some(log =>
          isSameDay(log.date, today)
        );

        if (goal.type === "daily" && alreadyLoggedToday) {
          return goal;
        }

        const increment = goal.type === "time" ? Number(amount) : 1;
        const newProgress = goal.progress + increment;

        const updated = {
          ...goal,
          progress: newProgress,
          logs: [...logs, { date: today, amount: increment }],
          updatedAt: new Date().toISOString()
        };

        if (!alreadyLoggedToday) {
          xpGained += 20;
          didLogToday = true;
        } else if (goal.type !== "daily") {
          xpGained += 5;
        }

        if (newProgress >= goal.target && goal.status !== "completed") {
          updated.status = "completed";
          completedNow = true;
          xpGained += 50;
        }

        return updated;
      })
    );

    setUserStats(prev => {

      let newStreak = prev.streak || 0;

      if (didLogToday) {
        if (!prev.lastLogDate) {
          newStreak = 1;
        } else if (isYesterday(prev.lastLogDate)) {
          newStreak += 1;
        } else if (!isSameDay(prev.lastLogDate, today)) {
          newStreak = 1;
        }
      } else if (prev.lastLogDate && !isSameDay(prev.lastLogDate, today)) {
        newStreak = 0;
      }

      if (didLogToday && newStreak > 0 && newStreak % 5 === 0) {
        xpGained += 30;
      }

      return {
        ...prev,
        xpTotal: prev.xpTotal + xpGained,
        streak: newStreak,
        lastLogDate: didLogToday ? today : prev.lastLogDate,
        completedCount: completedNow
          ? prev.completedCount + 1
          : prev.completedCount
      };
    });
  }

  return (
    <GoalContext.Provider
      value={{
        goals,
        userStats,
        createGoal,
        deleteGoal,
        updateGoal,
        togglePause,
        addProgress
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  return useContext(GoalContext);
}