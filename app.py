from datetime import date
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from urllib.parse import urlparse

import storage

ROOT = Path(__file__).parent
WEB_ROOT = ROOT / "frontend"


class DayWiseHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_ROOT), **kwargs)

    def send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        return json.loads(self.rfile.read(length) or b"{}")

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/tasks":
            return self.send_json(storage.list_tasks())
        if path == "/api/summary":
            return self.send_json(storage.daily_summary(date.today().isoformat()))
        if path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        try:
            data = self.read_json()
            if path == "/api/tasks":
                task_id = storage.add_task(data.get("title", ""), data.get("due_date", ""))
                return self.send_json({"id": task_id, "message": "Task added"})
            if path == "/api/wellness":
                storage.save_wellness(
                    date.today().isoformat(),
                    data.get("water_glasses", 0),
                    data.get("exercise_minutes", 0)
                )
                return self.send_json({"message": "Daily wellness saved"})
            return self.send_json({"error": "Not found"}, 404)
        except (ValueError, TypeError, json.JSONDecodeError) as error:
            return self.send_json({"error": str(error)}, 400)

    def do_PATCH(self):
        path = urlparse(self.path).path
        if path.startswith("/api/tasks/") and path.endswith("/complete"):
            try:
                task_id = path.split("/")[3]
                if storage.complete_task(task_id):
                    return self.send_json({"message": "Task completed"})
                return self.send_json({"error": "Task not found"}, 404)
            except ValueError:
                return self.send_json({"error": "Invalid task ID"}, 400)
        return self.send_json({"error": "Not found"}, 404)


if __name__ == "__main__":
    storage.initialize()
    print("DayWise is running at http://127.0.0.1:8000")
    ThreadingHTTPServer(("127.0.0.1", 8000), DayWiseHandler).serve_forever()
