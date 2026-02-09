let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setFilter(f) {
    filter = f;
    render();
}

function addTask() {
    const input = document.getElementById("taskInput");
    if (!input.value) return;

    const p = document.getElementById("priority").value;
    const due = document.getElementById("due").value;

    tasks.push({
        text: input.value,
        done: false,
        priority: p,
        due: due
    });

    input.value = "";
    save();
    render();
}

function render() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, i) => {

        if (filter === "todo" && task.done) return;
        if (filter === "done" && !task.done) return;

        const li = document.createElement("li");
        li.className = task.priority;

        // 滑动删除
        let startX = 0;
        li.ontouchstart = e => {
            startX = e.touches[0].clientX;
        };
        li.ontouchend = e => {
            let endX = e.changedTouches[0].clientX;
            if (startX - endX > 80) {
                if (confirm("滑动删除？")) {
                    tasks.splice(i, 1);
                    save();
                    render();
                }
            }
        };

        // 长按删除
        let pressTimer;
        li.onmousedown = () => {
            pressTimer = setTimeout(() => {
                if (confirm("删除任务？")) {
                    tasks.splice(i, 1);
                    save();
                    render();
                }
            }, 700);
        };
        li.onmouseup = () => clearTimeout(pressTimer);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.onchange = () => {
            task.done = checkbox.checked;
            save();
            render();
        };

        const span = document.createElement("span");
        span.textContent = task.text;
        span.style.marginLeft = "10px";

        if (task.done) span.className = "done";

        // 点击编辑
        span.onclick = () => {
            const newText = prompt("修改任务：", task.text);
            if (newText) {
                task.text = newText;
                save();
                render();
            }
        };

        li.appendChild(checkbox);
        li.appendChild(span);

        if (task.due) {
            const d = document.createElement("div");
            d.textContent = "截止：" + task.due;
            d.style.fontSize = "12px";
            li.appendChild(d);
        }

        list.appendChild(li);
    });

    const left = tasks.filter(t => !t.done).length;
    document.getElementById("count").textContent =
        "未完成：" + left + " 项";
}

render();
