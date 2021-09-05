;(function () {
    /**
     * STATE STUFF
     */
    let items = []
    let from = 0

    /**
     * REF STUFF
     */
    const tbody = document.getElementById('rows')
    const previous = document.getElementById('last')
    const next = document.getElementById('next')

    /****************\
     * RENDER STUFF *|
    \****************/

    function makeCell(text, link) {
        const element = document.createElement('td')
        if (link) {
            const link = document.createElement('a')
            link.href = link
            link.innerText = text
            element.appendChild(link)
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
        previous.disabled = from === 0
        next.disabled = from === 80

        tbody.innerHTML = ''

        for (var i = from; i < from + 20 && i < items.length; i++) {
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
        from = from - 20
        if (from < 0) {
            from = 0
        }

        render()
    })

    next.addEventListener('click', function () {
        from = from + 20
        if (from > 80) {
            from = 80
        }

        render()
    })

    fetch(
        'https://api.github.com/search/repositories?q=language:javascript&amp;sort=stars&amp;order=desc&amp;per_page=100'
    )
        .then((response) => response.json())
        .then((data) => {
            items = data.items
            render(from)
        })
})()
