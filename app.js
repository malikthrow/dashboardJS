async function getDashboardDataJson(url='/data.json'){
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

class ItemDashboard{
    static PERIOD = {
        Дни: 'Дни',
        Недели: 'Недели',
        Месяцы: 'Месяцы'
    }

    constructor(data, container = '.dashboard__content', view = 'Недели') {
        this.data = data;
        this.container = document.querySelector(container);
        this.view = view;

        this.createMarkUp()
    }
    createMarkUp(){
        const {title,timeframes} = this.data;
        const id = title.toLowerCase().replace(/ /g, '-');

        const {current,previous} = timeframes[this.view]

        this.container.insertAdjacentHTML('beforeend', `
        <div class="dashboard__cards ${id}">
            <article class="tracking-card">
              <header class="tracking-card_header">
                <h4 class="tracking-card__title">${title}</h4>
                <img class="tracking-card__menu" src="images/icon-ellipsis.svg" alt="Меню"/>
              </header>
              <div class="tracking-card_body">
                <div class="tracking-card_time">
                  ${current}hrs
                </div>
                <div class="tracking-card_prev">
                  ${ItemDashboard.PERIOD[this.view]} - ${previous}hrs
                </div>
              </div>
            </article>
        </div>
        `);
        this.time = this.container.querySelector(`.dashboard__cards.${id} .tracking-card_time`)
        this.prev = this.container.querySelector(`.dashboard__cards.${id} .tracking-card_prev`)

    }
    changeView(view){

        this.view = view

        const {current,previous} = this.data.timeframes[this.view]

        this.time.innerText = `${current}hrs`;
        this.prev.innerText = `Last ${ItemDashboard.PERIOD[view]} - ${previous}hrs`
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    getDashboardDataJson()
        .then(data=>{
            const activity = data.map(element => new ItemDashboard(element));
            const selectors = document.querySelectorAll('.dashboard__item');
            selectors.forEach(selector=>{
                selector.addEventListener('click', ()=>{
                    selectors.forEach(sel=>{
                        sel.classList.remove('active')
                        selector.classList.add('active');

                        const curView = selector.innerText.trim()
                        activity.forEach(act => act.changeView(curView))
                    })
                })
            })
        })
})