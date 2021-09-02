const $redact = document.querySelector(`#card`)

if($redact){
    $redact.addEventListener(`click` , (e) => {
        if(e.target.classList.contains(`minus`)){
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf
            fetch(`/card/remove/` + id, {
                method:`delete`,
                headers:{
                'X-XSRF-TOKEN':csrf
                }
            }).then(res => res.json())
            .then(cart => {
                if(cart.courses.length){
                    const html = cart.courses.map(c => {
                        return `
                        <tr>
                            <td>${c.title}</td>
                            <td>
                                <div class="quantity buttons_added">
                                    <input type="button" value="-" class="minus" data-id="${c._id}" data-csrf = "${csrf}">
                                    <input type="number" step="1" min="1" max="" name="quantity" value="${c.count}" title="Qty" class="input-text qty text" size="4" pattern="" inputmode="">
                                    <input type="button" value="+" class="plus" data-id="${c._id}" data-csrf = "${csrf}">
                                </div>
                                </td>
                                <td><form action="/card/deleteitem" method="POST">
                                    <input type="hidden" name="id" value="${c.id}">
                                    <input type="hidden" name="_csrf" value="@root.${{csrf}}">
                                    <button type="submit" id = "deletec" class = "btn red">Удалить</button>
                           </form>
                           </td>
                            <td>${c.price} грн/ед</td>
                        </tr>
                        `
                    }).join(``)
                    $redact.querySelector(`tbody`).innerHTML = html
                    $redact.querySelector(`.price`).textContent = cart.total + `грн`
                }else{
                    $redact.querySelector(`.price`).textContent = card.total
                    $redact.querySelector(`tbody`).innerHTML = `Курсов нет`
                }
            })
        }
    })
}
if($redact){
    $redact.addEventListener(`click`,(e) => {
        if(e.target.classList.contains(`plus`)){
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf

            fetch(`/card/counter/`+id ,{
                method:`POST`,
                headers:{
                    'X-XSRF-TOKEN':csrf
                }
            }).then(res => res.json())
            .then(cart => {
                if(cart.courses.length){
                    const html = cart.courses.map(c => {
                        return `
                        <tr>
                            <td>${c.title}</td>
                            <td>
                                <div class="quantity buttons_added">
                                    <input type="button" value="-" class="minus" data-id="${c._id}" data-csrf = "${csrf}">
                                    <input type="number" step="1" min="1" max="" name="quantity" value="${c.count}" title="Qty" class="input-text qty text" size="4" pattern="" inputmode="">
                                    <input type="button" value="+" class="plus" data-id="${c._id}" data-csrf = "${csrf}">
                                </div>
                                </td>
                                <td><form action="/card/deleteitem" method="POST">
                                    <input type="hidden" name="id" value="${c.id}">
                                    <input type="hidden" name="_csrf" value="@root.${{csrf}}">
                                    <button type="submit" id = "deletec" class = "btn red">Удалить</button>
                               </form>
                               </td>
                            <td>${c.price} грн/ед</td>
                        </tr>
                        `
                    }).join(``)
                    $redact.querySelector(`tbody`).innerHTML = html
                    $redact.querySelector(`.price`).textContent = cart.total + `грн`
                }
            })  
    }})
}

M.Tabs.init(document.querySelectorAll(`.tabs`));


