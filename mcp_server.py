from datetime import date
from mcp.server.fastmcp import FastMCP

import storage

storage.initialize()
mcp = FastMCP("DayWise Student Assistant")


@mcp.tool()
def list_academic_tasks() -> list[dict]:
    """Show the student's academic tasks and completion status."""
    return storage.list_tasks()


@mcp.tool()
def add_academic_task(title: str, due_date: str = "") -> str:
    """Add an academic task. Use a simple date such as 2026-11-25 when known."""
    task_id = storage.add_task(title, due_date)
    return f"Task added with ID {task_id}."


@mcp.tool()
def complete_academic_task(task_id: int) -> str:
    """Mark an academic task as completed."""
    if storage.complete_task(task_id):
        return "Task marked as completed."
    return "Task not found."


@mcp.tool()
def log_daily_wellness(water_glasses: int = 0, exercise_minutes: int = 0) -> str:
    """Record today's water intake in glasses and exercise duration in minutes."""
    storage.save_wellness(date.today().isoformat(), water_glasses, exercise_minutes)
    return "Today's wellness information has been saved."


@mcp.tool()
def get_student_daily_summary() -> dict:
    """Get a simple summary of tasks and today's recorded wellness."""
    return storage.daily_summary(date.today().isoformat())


if __name__ == "__main__":
    mcp.run()
