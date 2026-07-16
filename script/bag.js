// 가방 속 물품 객체를 화면에 출력

var myBag = [
    { name: "노트북", count: 1 },
    { name: "무선 이어폰", count: 1 },
    { name: "전공 책", count: 2 },
    { name: "물병", count: 1 },
    { name: "메모 노트", count: 3 }
];

function showMyBag() {
    var bagList = document.getElementById("bagList");
    bagList.innerHTML = "";

    for (var i = 0; i < myBag.length; i++) {
        var item = myBag[i];
        var li = document.createElement("li");
        li.textContent = "🔸 " + item.name + " x " + item.count;
        bagList.appendChild(li);
    }
}

document.getElementById("showBag").addEventListener("click", showMyBag);