const pokedex = document.getElementById('pokedex');
const moreButton = document.getElementById('more');
const caughtList = document.getElementById('caught');
const body = document.getElementsByName("body");
const allImages = document.getElementById('all-images');
const modal = document.querySelector('.modal');

moreButton.addEventListener("click", fetchNextPokemon)

let pokemonList = [];
let caughtPokemon = [];

let nextPokemon = "";

function createPokemonElement(name, url) {
    const pokeDiv = document.createElement('div');
    pokeDiv.classList.add('pokemon');
    pokeDiv.id = name
    pokeDiv.textContent = name;
    pokeDiv.addEventListener('click', function() {
        fetch(url)
            .then(response => response.json())
            .then(pokeData => {
                showModal(pokeData);
            });
    });
    return pokeDiv;
}

function addPokeInfo(pokeDiv, pokemon) {
    fetch(pokemon.url)
        .then(response => response.json())
        .then(pokeData => {
            const pokeImg = document.createElement('img');
            pokeImg.src = pokeData.sprites.front_default;
            pokeDiv.appendChild(pokeImg);
        })
}

function fetchPokemon(url){
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            nextPokemon = data.next;

            data.results.forEach(pokemon => {
                const pokemonElement = createPokemonElement(pokemon.name, pokemon.url);
                addPokeInfo(pokemonElement, pokemon);
                pokedex.appendChild(pokemonElement);
            })
        });
}

function fetchFirstPokemon(){
    fetchPokemon("https://pokeapi.co/api/v2/pokemon");
    loadCaughtList();
}

function fetchNextPokemon(){
    fetchPokemon(nextPokemon);
}


function showModal(pokemon) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML =`
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <p>Height: ${pokemon.height}</p>
            <p>Weight: ${pokemon.weight}</p>
            <ul>
                <li>${pokemon.moves[0].move.name}</li>
                <li>${pokemon.moves[1].move.name}</li>
                <li>${pokemon.moves[2].move.name}</li>
                <li>${pokemon.moves[3].move.name}</li>
            
            </ul>
            <button class="catch" id="catch">Catch</button>
        </div>`;

    document.body.appendChild(modal);

    const catchButton = document.getElementById('catch');
    catchButton.addEventListener('click', function (e) {
        caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon'));
        if(caughtPokemon !== null){ caughtPokemon.push(pokemon);
        const caughtPokemonJSON = JSON.stringify(caughtPokemon);
        localStorage.setItem('caughtPokemon', caughtPokemonJSON);
    }
        const pokeDiv = document.createElement('div');
        pokeDiv.classList.add('pokemon');
        pokeDiv.id = pokemon.name;
        pokeDiv.textContent = pokemon.name;

        const pokeImg = document.createElement('img');
        pokeImg.src = pokemon.sprites.front_default;
        pokeDiv.appendChild(pokeImg);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function (e){
            removeFromCaughtList(pokemon);
        })
        pokeDiv.appendChild(removeButton);

        caughtList.appendChild(pokeDiv);
    })

    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
}

function loadCaughtList(){
    let savedPokemonJSON = localStorage.getItem('caughtPokemon');
    let savedPokemon = JSON.parse(savedPokemonJSON);
    if(savedPokemon === null){
        return;
    }
    console.log(savedPokemon);
    savedPokemon.forEach(pokemon => {
        const pokeDiv = document.createElement('div');
        pokeDiv.classList.add('pokemon');
        pokeDiv.id = pokemon.name;
        pokeDiv.textContent = pokemon.name;

        const pokeImg = document.createElement('img');
        pokeImg.src = pokemon.sprites.front_default;
        pokeDiv.appendChild(pokeImg);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function (e){
            removeFromCaughtList(pokemon);
        })
        pokeDiv.appendChild(removeButton);

        caughtList.appendChild(pokeDiv);
    })
}

function removeFromCaughtList(removePokemon){
    caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon'));

    if(caughtPokemon === null){
        caughtPokemon= [];
    }
    const pokemonIndex = caughtPokemon.findIndex(pokemon => pokemon.name === removePokemon.name);
    caughtPokemon.splice(pokemonIndex, 1);
    const caughtPokemonJSON = JSON.stringify(caughtPokemon);
    localStorage.setItem('caughtPokemon', caughtPokemonJSON);

    for (let i = 0; i < caughtList.children.length; i++) {
        const childElement = caughtList.children[i];
        console.log(caughtPokemon.name);
        if(childElement.id === removePokemon.name){
            childElement.remove();
        }
    }
}

