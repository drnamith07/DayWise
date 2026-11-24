# DayWise – Your Smart Student Life Assistant

DayWise is a simple student-life assistant built for the **Make MCP Matter – Less Magic, More Utility** track.

It demonstrates one practical idea: students can manage academic tasks and record basic wellness habits in one place, while an MCP server exposes the same actions as tools an AI assistant could use.

## What this basic demo does

- Add and view academic tasks
- Mark tasks as completed
- Record daily water intake and exercise minutes
- View a simple daily summary
- Expose the same student-life actions through MCP tools

## Technology

- Python
- HTML, CSS and JavaScript
- SQLite (a small local database file)
- Model Context Protocol (MCP) Python SDK

## Run the web demo

1. Open a terminal in this project folder.
2. Create and activate a virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the app:

   ```bash
   python3 app.py
   ```

5. Open http://127.0.0.1:8000 in your browser.

## Run the MCP server

Keep the web app running. Open a second terminal in this project folder, activate the same virtual environment, then run:

```bash
python3 mcp_server.py
```

The MCP server uses the same local database as the web demo and exposes tools for listing, adding and completing tasks, recording wellness data, and getting a daily summary. It communicates over standard input/output and waits for an MCP-compatible client.

## Project structure

```text
DayWise/
├── app.py
├── storage.py
├── mcp_server.py
├── requirements.txt
├── README.md
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Current scope and limitations

This is an initial working prototype. It uses a local SQLite database and basic rule-based summaries. It does not yet include an LLM, automatic AI recommendations, college integrations, authentication, or cloud hosting. Those can be explored later if the team selects them for deeper development.
