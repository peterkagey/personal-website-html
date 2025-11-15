let API_BASE_URL
if ("production" == "development") {
  API_BASE_URL = "http://127.0.0.1:8000"
} else {
  API_BASE_URL = "https://api.peterkagey.com"
}
var highScoresDiv = document.getElementById("high-scores");
highScoresDiv.className = "high-scores"
var header = document.createElement("h1");
var level = (new URLSearchParams(window.location.search)).get("level");

if (level) { handleLevel() } else { handleBlankPage() }

function numberString(n, digitWidth) {
  if (n > 0) {
    return String(n).padStart(digitWidth, " ")
  } else {
    return " ".repeat(digitWidth)
  }
}

function lineBreakSolution(solutionString, solutionWidth) {
  const values = solutionString.split(",").map(Number);
  const w = String(Math.max(...values)).length;
  const literalSolution = values
    .map((n, i) => ((i > 0 && i % solutionWidth === 0) ? "\n " + numberString(n, w) : " " + numberString(n, w)))
    .join("")
  return {
    literalSolution: literalSolution,
    solutionCharacterWidth: solutionWidth * (1 + w)
  }
}

function appendSolution(item, copy) {
  var solutionDiv = document.createElement("div")
  solutionDiv.className = "solution"

  var hr = document.createElement("hr")

  const date = new Date(item.created_at)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  var label = document.createElement("p")
  label.innerHTML = `${copy} f(${item.level}) ≤ ${item.vertices}.<br><i>(Submitted on ${year}-${month}-${day}.)</i>`

  var newPre = document.createElement("pre");
  const solutionInfo = lineBreakSolution(item.solution, item.max_a);
  const maxFont = 100 / (solutionInfo.solutionCharacterWidth + 1)
  newPre.style.fontSize = `min(${maxFont}vw, 2em)`;

  var link = document.createElement("a");
  link.href = `/apps/square_game/?id=${item.id}`
  link.textContent = solutionInfo.literalSolution;

  highScoresDiv.appendChild(solutionDiv)
  solutionDiv.appendChild(hr)
  solutionDiv.appendChild(label)
  solutionDiv.appendChild(newPre)
  newPre.appendChild(link)
}

function handleLevel() {
  header.textContent = `Solutions for level ${level}`
  header.style.marginBottom = 0
  highScoresDiv.appendChild(header);

  var newGameLink = document.createElement("p")
  newGameLink.style.margin = 0
  newGameLink.innerHTML = `(<a href="/apps/square_game/">Start new game</a>)`
  highScoresDiv.appendChild(newGameLink)

  fetch(`${API_BASE_URL}/square_game/records/${level}`)
    .then(response => {
      if (response.ok) { return response.json() }
      else { throw new Error(`ID not found: ${response}`) }
    })
    .then(data => {
      if (data.earliest_record) { appendSolution(data.earliest_record, "The first submission showing that") }
      if (data.latest_record) { appendSolution(data.latest_record, "The most recent record-matching submission showing that") }
      if (data.latest_attempt) { appendSolution(data.latest_attempt, "The most recent submission, which is <i>not</i> a record, but which shows that") }
    })
    .catch(error => console.warn(error))
}

function bound(n) {
  const boundSequence = [NaN,0,2,4,6,8,11,15,19,23,28,34,40,46,53,61,69,77,86,96,106,116,127,139,151,163,176,190,204,218,233,249,265,281,298,316,334,352,371,391,411,431,452,474,496,518,541,565,589,613,638,664,690,716,743,771,799,827,856,886,916,946,977];
  return Math.max(boundSequence[n], n * Math.ceil((n-1)/4));
}

function handleBlankPage() {
  header.textContent = "Records for each level"
  header.style.marginBottom = 0
  highScoresDiv.appendChild(header);

  var newGameLink = document.createElement("p")
  newGameLink.style.margin = 0
  newGameLink.innerHTML = `(<a href="/apps/square_game/">Start new game</a>)`
  highScoresDiv.appendChild(newGameLink)

  var hr = document.createElement("hr")
  highScoresDiv.appendChild(hr)

  var records = document.createElement("div");
  records.id = "records"
  highScoresDiv.appendChild(records)

  fetch(`${API_BASE_URL}/square_game/records`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("records");
    var grid = document.createElement("div");
    grid.className = "grid wide-five narrow-three";

    data.forEach(record => {
      const li = document.createElement("div");
      if (
        (record.level == 3 && record.vertices == 4) ||
        (record.level == 4 && record.vertices == 6) ||
        (record.level == 5 && record.vertices == 9) ||
        (record.level == 6 && record.vertices == 12) ||
        (record.level == 7 && record.vertices == 15) ||
        (record.level == 8 && record.vertices == 19) ||
        (record.level == 9 && record.vertices == 24) ||
        (record.level == 10 && record.vertices == 30) ||
        (record.level == 11 && record.vertices == 34) ||
        (record.level == 14 && record.vertices == 56)
      ) {
        li.innerHTML = `<a href="/apps/square_game/high_scores/?level=${record.level}">f(${record.level}) = ${record.vertices}</a>`;
        grid.appendChild(li);
      } else if (record.level > 2) {
        li.innerHTML = `<a href="/apps/square_game/high_scores/?level=${record.level}">${bound(record.level)} ≤ f(${record.level}) ≤ ${record.vertices}</a>`;
        grid.appendChild(li);
      }
    });

    container.appendChild(grid);
  })
  .catch(err => console.error("Error loading records:", err));
}