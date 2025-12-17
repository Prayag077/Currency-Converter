const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".dropdown i");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;

    select.append(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

function updateFlag(el) {
  let code = el.value;
  let countryCode = countryList[code];
  el.parentElement.querySelector("img").src =
    `https://flagsapi.com/${countryCode}/flat/64.png`;
}

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  btn.classList.add("loading");

  let amount = document.querySelector(".amount input").value || 1;

  const URL = `${BASE_URL}${fromCurr.value.toLowerCase()}.json`;
  let res = await fetch(URL);
  let data = await res.json();

  let rate =
    data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
  let final = amount * rate;

  animateResult(amount, fromCurr.value, final, toCurr.value);
  btn.classList.remove("loading");
});

function animateResult(amount, from, final, to) {
  let start = 0;
  let duration = 600;
  let startTime = null;

  function animate(time) {
    if (!startTime) startTime = time;
    let progress = Math.min((time - startTime) / duration, 1);
    let current = progress * final;

    msg.innerText = `${amount} ${from} equals ${current.toFixed(2)} ${to}`;
    if (progress < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

swapIcon.addEventListener("click", () => {
  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  updateFlag(fromCurr);
  updateFlag(toCurr);
  msg.innerText = "Currencies swapped. Ready to convert.";
});
