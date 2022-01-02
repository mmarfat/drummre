const form = document.querySelector('form')
const main = document.getElementById('mymain')

async function getTvQuotes(url) {
  const resp = await fetch(url)
  const respData = await resp.json()
  showTvQuotes(respData)
}

function showTvQuotes(tvQuotes) {

  main.innerHTML = ''

  tvQuotes.forEach(tvQuote => {

    const {quote, source, author} = tvQuote
    const showEl = document.createElement('div');
    showEl.classList.add('show')

    showEl.innerHTML = `
        
        <div class="tv-quote-info">
            <span>${quote}</span>
            <span>- ${source}</span>
            <span>- ${author}</span>
        </div>
        <form id="myform" method="post" action="/quotes/likes">
        <input type="hidden" id="quote" name="quote" value="${quote}">
        <input type="hidden" id="source" name="source" value="${source}">
        <input type="hidden" id="author" name="author" value="${author}">
        <button type="submit" class="btn btn-success">
            <i class="fa fa-heart"></i>
        </button>
        </form>

        `;

    main.appendChild(showEl)

  })
}

getTvQuotes('http://localhost:3001/type/tv');
