console.log("つながった！");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");

document.querySelectorAll(".popup-img").forEach(img => {

    img.addEventListener("click", function(){

        modal.style.display = "flex";

        modalImg.src = this.src;

    });

});

document.querySelector(".close").addEventListener("click", function(){

    modal.style.display = "none";

});

modal.addEventListener("click", function(e){

    if(e.target === modal){

        modal.style.display = "none";

    }

});

function createGraph(id, data, scale){

    const graph = document.getElementById(id);

    data.forEach(item=>{

        graph.innerHTML += `
        <div class="item">
            <div class="bar" style="height:${item.value*scale}px">
                ${item.value}
            </div>
            <p>${item.name}</p>
        </div>
        `;

    });

}

document.addEventListener('DOMContentLoaded', () => {
    const cards = [...document.querySelectorAll('main .card')];
    const track = document.getElementById('carouselTrack');
    const counter = document.getElementById('carouselCounter');

    if (!cards.length || !track || !counter) return;

    let current = 0;
    let timer;
    let paused = false;

    // 既存のプロフィールから名前と紹介文を取得
    const comedians = cards.map((card, index) => ({
        name: card.querySelector('h2')?.textContent.trim()
              || `漫才師 ${index + 1}`,
        description: card.querySelector('h4')?.textContent.trim()
                     || '漫才の分析データを見る',
        target: card
    }));

    function render() {
        track.replaceChildren();

        [-1, 0, 1].forEach(offset => {
            const index =
                (current + offset + comedians.length)
                % comedians.length;

            const comedian = comedians[index];
            const isCenter = offset === 0;
            const button = document.createElement('button');

            button.type = 'button';
            button.className = 'carousel-card ' +
                (isCenter ? 'is-center' : 'is-side');

            const title = document.createElement('h3');
            title.textContent = comedian.name;
            button.appendChild(title);

            const description = document.createElement('p');
            description.textContent = comedian.description;
            button.appendChild(description);

            if (isCenter) {
                const link = document.createElement('span');
                link.className = 'card-link';
                link.textContent = '分析を見る ↓';
                button.appendChild(link);

                button.setAttribute(
                    'aria-label',
                    comedian.name + 'の分析へ移動'
                );

                button.addEventListener('click', () => {
                    //すべてのコンビのカードを隠す
                    card.forEach(card => {
                        card.hidden = true;
                    });
                    
                    //選んだコンビだけ表示
                    comedian.target.hidden = false;

                    //戻るボタンを表示
                    document.getElementById('backToCarousel').hidden = false;

                    //選んだカードまで移動
                    comedian.target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });

            } else {
                button.setAttribute(
                    'aria-label',
                    comedian.name + 'を中央に表示'
                );

                button.addEventListener('click', () => {
                    current = index;
                    render();
                    restartTimer();
                });
            }

            track.appendChild(button);
        });

        counter.textContent =
            `${String(current + 1).padStart(2, '0')} / ` +
            `${String(comedians.length).padStart(2, '0')}`;
    }

    function move(step) {
        current =
            (current + step + comedians.length)
            % comedians.length;
        render();
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function startTimer() {
        stopTimer();

        if (paused || comedians.length < 2) return;

        timer = setInterval(() => {
            move(1);
        }, 4000);
    }

    function restartTimer() {
        startTimer();
    }

    document.getElementById('prevBtn')
        .addEventListener('click', () => {
            move(-1);
            restartTimer();
        });

    document.getElementById('nextBtn')
        .addEventListener('click', () => {
            move(1);
            restartTimer();
        });

    track.addEventListener('mouseenter', () => {
        paused = true;
        stopTimer();
    });

    track.addEventListener('mouseleave', () => {
        paused = false;
        startTimer();
    });

    // キーボード・タッチ操作への配慮
    track.addEventListener('focusin', () => {
        paused = true;
        stopTimer();
    });

    track.addEventListener('focusout', event => {
        if (!track.contains(event.relatedTarget)) {
            paused = false;
            startTimer();
        }
    });


const backButton = document.getElementById('backToCarousel');

backButton.addEventListener('click', () => {
    // すべてのコンビを再表示
    cards.forEach(card => {
        card.hidden = false;
    });

    backButton.hidden = true;

    // カルーセルに戻る
    document.querySelector('.manzai-carousel')
        .scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
});

render();
startTimer();

// 平均ネタ秒数（秒）
createGraph("neta",[
    {name:"創成期",value:307},
    {name:"革命期",value:291},
    {name:"変革期",value:288},
    {name:"現代期",value:259}
],0.5);

// 平均ボケ数
createGraph("boke",[
    {name:"創成期",value:29.7},
    {name:"革命期",value:29.7},
    {name:"変革期",value:31.7},
    {name:"現代期",value:18.3}
],5);

// 平均ツッコミ数
createGraph("tsukkomi",[
    {name:"創成期",value:19.7},
    {name:"革命期",value:31.3},
    {name:"変革期",value:37},
    {name:"現代期",value:22.3}
],5);

// 平均ボケ間隔
createGraph("bokeTime",[
    {name:"創成期",value:10.3},
    {name:"革命期",value:9.8},
    {name:"変革期",value:9.1},
    {name:"現代期",value:14.2}
],10);

// 平均ツッコミ間隔
createGraph("tsukkomiTime",[
    {name:"創成期",value:15.6},
    {name:"革命期",value:9.3},
    {name:"変革期",value:7.8},
    {name:"現代期",value:11.6}
],10);