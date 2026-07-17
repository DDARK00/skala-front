// 가방 속 물품 객체를 화면에 출력

const myBag = [
  { name: "노트북", count: 1 },
  { name: "유선 이어폰", count: 1 },
  { name: "메모장", count: 2 },
  { name: "텀블러", count: 1 },
  { name: "충전기", count: 3 },
];

function showMyBag() {
  const bagList = document.getElementById("bagList");
  bagList.innerHTML = "";

  for (let i = 0; i < myBag.length; i++) {
    const item = myBag[i];
    const li = document.createElement("li");
    li.textContent = "🔸 " + item.name + " x " + item.count;
    bagList.appendChild(li);
  }
  alert(bagList.innerText);
}

document.getElementById("showBag").addEventListener("click", showMyBag);
