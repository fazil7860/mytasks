// Filename: app.js
// Sidekick code-purpose: Implements React state and interactions for adding, completing, and deleting to-do tasks.
(function () {
  "use strict";

  var h = React.createElement;
  var useRef = React.useRef;
  var useState = React.useState;

  function TaskItem(props) {
    var task = props.task;
    var toggleLabel = task.completed
      ? "Mark " + task.text + " as incomplete"
      : "Mark " + task.text + " as complete";

    return h(
      "li",
      { className: "task-item" + (task.completed ? " is-complete" : "") },
      h(
        "label",
        { className: "check-control" },
        h("input", {
          type: "checkbox",
          checked: task.completed,
          onChange: function () {
            props.onToggle(task.id);
          },
          "aria-label": toggleLabel
        }),
        h("span", { className: "checkmark", "aria-hidden": "true" })
      ),
      h("span", { className: "task-text" }, task.text),
      h(
        "button",
        {
          type: "button",
          className: "delete-button",
          onClick: function () {
            props.onDelete(task.id);
          },
          "aria-label": "Delete " + task.text
        },
        "Delete"
      )
    );
  }

  function TodoApp() {
    var tasksState = useState([]);
    var tasks = tasksState[0];
    var setTasks = tasksState[1];
    var draftState = useState("");
    var draft = draftState[0];
    var setDraft = draftState[1];
    var inputRef = useRef(null);
    var nextTaskId = useRef(1);

    function addTask(event) {
      event.preventDefault();

      var text = draft.trim();
      if (!text) {
        return;
      }

      var newTask = {
        id: nextTaskId.current,
        text: text,
        completed: false
      };

      nextTaskId.current += 1;
      setTasks(function (currentTasks) {
        return currentTasks.concat(newTask);
      });
      setDraft("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    function toggleTask(taskId) {
      setTasks(function (currentTasks) {
        return currentTasks.map(function (task) {
          if (task.id !== taskId) {
            return task;
          }

          return Object.assign({}, task, { completed: !task.completed });
        });
      });
    }

    function deleteTask(taskId) {
      setTasks(function (currentTasks) {
        return currentTasks.filter(function (task) {
          return task.id !== taskId;
        });
      });
    }

    var completedCount = tasks.filter(function (task) {
      return task.completed;
    }).length;
    var remainingCount = tasks.length - completedCount;
    var remainingSummary = remainingCount === 1
      ? "1 task left"
      : remainingCount + " tasks left";
    var completedSummary = completedCount === 1
      ? "1 complete"
      : completedCount + " complete";

    return h(
      "main",
      { className: "app-shell" },
      h(
        "section",
        { className: "todo-card", "aria-labelledby": "app-title" },
        h(
          "header",
          { className: "hero" },
          h("p", { className: "eyebrow" }, "Your personal checklist"),
          h("h1", { id: "app-title" }, "Task Bloom"),
          h(
            "p",
            { className: "intro" },
            "Capture a task, then check it off when it is done."
          )
        ),
        h(
          "form",
          { className: "task-form", onSubmit: addTask, "aria-label": "Add a new task" },
          h(
            "label",
            { className: "sr-only", htmlFor: "new-task" },
            "What needs to be done?"
          ),
          h("input", {
            ref: inputRef,
            id: "new-task",
            className: "task-input",
            name: "task",
            type: "text",
            value: draft,
            onChange: function (event) {
              setDraft(event.target.value);
            },
            placeholder: "What needs to be done?",
            autoComplete: "off",
            autoFocus: true,
            maxLength: 120,
            required: true,
            "aria-describedby": "task-help"
          }),
          h(
            "button",
            {
              className: "add-button",
              type: "submit",
              disabled: draft.trim().length === 0
            },
            "Add task"
          ),
          h(
            "p",
            { id: "task-help", className: "form-note" },
            "Press Enter or select Add task."
          )
        ),
        h(
          "section",
          { className: "task-list-section", "aria-labelledby": "task-list-heading" },
          h(
            "div",
            { className: "list-heading" },
            h("h2", { id: "task-list-heading" }, "Your tasks"),
            h(
              "p",
              { className: "task-count", role: "status", "aria-live": "polite" },
              remainingSummary + " · " + completedSummary
            )
          ),
          tasks.length === 0
            ? h(
              "div",
              { className: "empty-state", role: "status" },
              h("span", { className: "empty-mark", "aria-hidden": "true" }, "✓"),
              h("p", null, "No tasks yet"),
              h("p", null, "Add one above to get started.")
            )
            : h(
              "ul",
              { className: "task-list", "aria-label": "To-do tasks" },
              tasks.map(function (task) {
                return h(TaskItem, {
                  key: task.id,
                  task: task,
                  onToggle: toggleTask,
                  onDelete: deleteTask
                });
              })
            )
        ),
        h(
          "footer",
          { className: "card-footer" },
          "A small list for a focused day."
        )
      )
    );
  }

  var mountNode = document.getElementById("root");

  if (mountNode) {
    ReactDOM.createRoot(mountNode).render(h(TodoApp));
  }
}());
