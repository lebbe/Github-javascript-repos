;(function () {
    /**
     * STATE STUFF
     */
    let items = []
    let page = 0

    /**
     * REF/CONST STUFF
     */
    const pagesize = 20
    const tbody = document.getElementById('rows')
    const previous = document.getElementById('last')
    const next = document.getElementById('next')
    const fromText = document.getElementById('from')
    const toText = document.getElementById('to')
    const totalText = document.getElementById('total')

    /****************\
     * RENDER STUFF *|
    \****************/

    function makeCell(text, link) {
        const element = document.createElement('td')
        if (link) {
            const linkNode = document.createElement('a')
            linkNode.href = link
            linkNode.innerText = text
            element.appendChild(linkNode)
        } else {
            element.innerText = text // Avoid all sorts of XSS
            element.className = 'number'
        }
        return element
    }

    function makeRow(name, repo, homepage, forks, issues, stars) {
        const row = document.createElement('tr')

        row.appendChild(makeCell(name, repo))
        row.appendChild(makeCell(homepage, homepage))
        row.appendChild(makeCell(forks))
        row.appendChild(makeCell(issues))
        row.appendChild(makeCell(stars))

        return row
    }

    function render() {
        const pages = items.length / pagesize
        const from = page * pagesize
        previous.disabled = page === 0
        next.disabled = page + 1 === pages

        fromText.innerText = from
        toText.innerText = from + pagesize
        totalText.innerText = items.length

        tbody.innerHTML = ''

        for (var i = from; i < from + pagesize; i++) {
            const {
                name,
                clone_url,
                homepage,
                forks,
                stargazers_count,
                open_issues,
            } = items[i]

            tbody.appendChild(
                makeRow(
                    name,
                    clone_url,
                    homepage,
                    forks,
                    open_issues,
                    stargazers_count
                )
            )
        }
    }

    /*********************\
	|* Dynamic Web FTW. * |
	\*********************/

    previous.addEventListener('click', function () {
        page--
        if (page < 0) {
            page = 0
        }

        render()
    })

    next.addEventListener('click', function () {
        page++
        if (page - 1 > items.length / pagesize) {
            page = items.length / pagesize - 1
        }

        render()
    })

    fetch(
        'https://api.github.com/search/repositories?q=language:javascript&amp;sort=stars&amp;order=desc&amp;per_page=100'
    )
        .then((response) => response.json())
        .then((data) => {
            items = data.items
            render()
        })
})()
