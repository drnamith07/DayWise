const $ = (id) => document.getElementById(id);
const message = (text) => { $("message").textContent = text; };

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

async function refresh() {
  try {
    const [tasks, summary] = await Promise.all([
      request("/api/tasks"),
      request("/api/summary")
    ]);
    $("completed").textContent = summary.completed_tasks;
    $("pending").textContent = summary.pending_tasks;
    $("water-total").textContent = summary.water_glasses;
    $("exercise-total").textContent = summary.exercise_minutes;

    const list = $("task-list");
    list.replaceChildren();
    if (!tasks.length) {
      const empty = document.createElement("li");
      empty.textContent = "No tasks yet. Add your first task above.";
      list.append(empty);
    }
    tasks.forEach((task) => {
      const item = document.createElement("li");
      const details = document.createElement("div");
      const title = document.createElement("span");
      title.textContent = task.title;
      if (task.completed) title.className = "done";
      details.append(title);
      if (task.due_date) {
        const due = document.createElement("small");
        due.textContent = `Due: ${task.due_date}`;
        details.append(due);
      }
      item.append(details);
      if (!task.completed) {
        const button = document.createElement("button");
        button.textContent = "Complete";
        button.addEventListener("click", async () => {
          try {
            await request(`/api/tasks/${task.id}/complete`, { method: "PATCH" });
            message("Task completed.");
            refresh();
          } catch (error) { message(error.message); }
        });
        item.append(button);
      } else {
        const status = document.createElement("small");
        status.textContent = "Completed";
        item.append(status);
      }
      list.append(item);
    });
  } catch (error) {
    message(error.message);
  }
}

$("task-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await request("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: $("task-title").value, due_date: $("task-date").value })
    });
    $("task-title").value = "";
    $("task-date").value = "";
    message("Task added.");
    refresh();
  } catch (error) { message(error.message); }
});

$("wellness-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await request("/api/wellness", {
      method: "POST",
      body: JSON.stringify({
        water_glasses: Number($("water").value),
        exercise_minutes: Number($("exercise").value)
      })
    });
    message("Today's wellbeing record saved.");
    refresh();
  } catch (error) { message(error.message); }
});

refresh();
