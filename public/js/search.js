const form = document.querySelector('form')
const search = document.getElementById('search')
const main = document.getElementById('mymain')

// Dosta ruzno rjesenje, ako netko zna bolji nacin bilo bi dobro promijenit

// Svaki put kad netko posalje submit u search input polju upali se event listener koji zove api (tvmaze.com)
// Nakon toga se svi ti showovi (msm da ih vrati 10) vrate u obliku onih kartica sa slikom, ocjenom naslovom i gumbom za like. (to je ovaj innerHTML)


async function getShows(url) {
    const resp = await fetch(url)
    const respData = await resp.json()
    showShows(respData)
}


function showShows(shows) {

    main.innerHTML = ''

    shows.forEach(show => {

        const { id, image, name, rating } = show.show
        const showEl = document.createElement('div');
        showEl.classList.add('show')

        if (id <= 5000) {
            showEl.innerHTML = `
        <img
            src="${(image === null) ? 'https://domel.hr/wp-content/uploads/2020/12/placeholder.png' : image.medium}"
            alt="${name}"
        />
        <div class="show-info">
            <h3>${name}</h3>
            <span>${(rating.average === null) ? 'N/A' : rating.average}</span>
        </div>
        <form id="myform" method="post" action="/shows">
        <input type="hidden" id="id" name="id" value="${id}">
        <input type="hidden" id="name" name="name" value="${name}">
        <input type="hidden" id="image" name="image" value="${(image === null) ? 'https://domel.hr/wp-content/uploads/2020/12/placeholder.png' : image.medium}">
        <input type="hidden" id="rating" name="rating" value="${(rating.average === null) ? 'N/A' : rating.average}">
        <button type="submit" class="btn btn-success">
            <i class="fa fa-heart"></i>
        </button>
        </form>

        `;

            main.appendChild(showEl)
        }

    })
}

form.addEventListener('submit', e => {
    e.preventDefault()

    const searchTerm = search.value
    console.log(searchTerm)
    if (searchTerm) {

        getShows('https://api.tvmaze.com/search/shows?q=' + searchTerm)

        search.value = '';
    }
})
