import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name("daywise.db")


def connect():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize():
    with connect() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                due_date TEXT DEFAULT '',
                completed INTEGER NOT NULL DEFAULT 0
            )
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS wellness (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entry_date TEXT NOT NULL UNIQUE,
                water_glasses INTEGER NOT NULL DEFAULT 0,
                exercise_minutes INTEGER NOT NULL DEFAULT 0
            )
        """)


def list_tasks():
    with connect() as db:
        rows = db.execute(
            "SELECT id, title, due_date, completed FROM tasks ORDER BY completed, id DESC"
        ).fetchall()
        return [dict(row) for row in rows]


def add_task(title, due_date=""):
    title = title.strip()
    if not title:
        raise ValueError("Task title cannot be empty.")
    with connect() as db:
        cursor = db.execute(
            "INSERT INTO tasks (title, due_date) VALUES (?, ?)",
            (title, due_date.strip())
        )
        return cursor.lastrowid


def complete_task(task_id):
    with connect() as db:
        cursor = db.execute(
            "UPDATE tasks SET completed = 1 WHERE id = ?", (int(task_id),)
        )
        return cursor.rowcount > 0


def save_wellness(entry_date, water_glasses, exercise_minutes):
    with connect() as db:
        db.execute("""
            INSERT INTO wellness (entry_date, water_glasses, exercise_minutes)
            VALUES (?, ?, ?)
            ON CONFLICT(entry_date) DO UPDATE SET
                water_glasses = excluded.water_glasses,
                exercise_minutes = excluded.exercise_minutes
        """, (entry_date, max(0, int(water_glasses)), max(0, int(exercise_minutes))))


def daily_summary(entry_date):
    tasks = list_tasks()
    with connect() as db:
        row = db.execute(
            "SELECT water_glasses, exercise_minutes FROM wellness WHERE entry_date = ?",
            (entry_date,)
        ).fetchone()

    wellness = dict(row) if row else {"water_glasses": 0, "exercise_minutes": 0}
    total = len(tasks)
    completed = sum(1 for task in tasks if task["completed"])
    return {
        "date": entry_date,
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": total - completed,
        "water_glasses": wellness["water_glasses"],
        "exercise_minutes": wellness["exercise_minutes"],
        "message": "Great progress!" if total > 0 and completed == total else "Keep taking small steps today."
    }
