import { useEffect, useState } from "react";

function LongTaskMonitor() {
  const [longTasks, setLongTasks] = useState([]);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries().map((entry) => ({
        name: entry.name,
        duration: entry.duration,
        startTime: entry.startTime,
      }));

      entries.forEach((entry) => {
        console.log(`Long task detected: ${entry.duration} ms`);
      });

      setLongTasks((prev) => [...prev, ...entries]);
    });

    observer.observe({ type: "longtask", buffered: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Long tasks</h2>
      {longTasks.length === 0 ? (
        <p>No long tasks detected yet.</p>
      ) : (
        <ul>
          {longTasks.map((task) => (
            <li key={task.startTime}>
              Duration: {task.duration.toFixed(2)} ms, start:{" "}
              {task.startTime.toFixed(2)} ms
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LongTaskMonitor;
