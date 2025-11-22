function bound(n) {
  const boundSequence = [NaN,0,2,4,6,8,11,15,19,23,28,34,40,46,53,61,69,77,86,96,106,116,127,139,151,163,176,190,204,218,233,249,265,281,298,316,334,352,371,391,411,431,452,474,496,518,541,565,589,613,638,664,690,716,743,771,799,827,856,886,916,946,977];
  return Math.max(boundSequence[n], n * Math.ceil((n-1)/4));
}

fetch(`${API_BASE_URL}/square_game/records`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("records");
    var grid = document.createElement("div");
    grid.className = "grid wide-five narrow-three";

    data.forEach(record => {
      const div = document.createElement("div");
      const a = document.createElement("a")
      a.href = `/apps/square_game/high_scores/?level=${record.level}`
      if (record.level > 2) {
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
          a.textContent = `f(${record.level}) = ${record.vertices}`
        } else {
          a.textContent = `${bound(record.level)} ≤ f(${record.level}) ≤ ${record.vertices}`
        }
        grid.appendChild(div);
        div.appendChild(a)
      }
    });

    container.appendChild(grid);
  })
  .catch(err => console.error("Error loading records:", err));
