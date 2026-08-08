const search = document.querySelector("#forum-search");
const buttons = [...document.querySelectorAll("[data-filter]")];
const boards = [...document.querySelectorAll("#board-list article")];
const empty = document.querySelector("#empty-state");
let activeFilter = "All";

function updateBoards() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  boards.forEach((board) => {
    const categoryMatch = activeFilter === "All" || board.dataset.category === activeFilter;
    const content = `${board.dataset.search} ${board.textContent}`.toLowerCase();
    const searchMatch = !query || content.includes(query);
    const show = categoryMatch && searchMatch;
    board.hidden = !show;
    if (show) visible += 1;
  });
  empty.hidden = visible !== 0;
}

search.addEventListener("input", updateBoards);
buttons.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  buttons.forEach((item) => item.classList.toggle("active", item === button));
  updateBoards();
}));
