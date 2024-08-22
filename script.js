const publicKey = "fadcbf8c05a00b847c59a4ca215c09af";
const privateKey = "6b48d6c0b9a695e19de905a387cafcf1b89fba8d";

const ts = Date.now();

function generateHash(ts, privateKey, publicKey) {
    const stringToHash = ts + privateKey + publicKey;
    return CryptoJS.MD5(stringToHash).toString();
}

const hash = generateHash(ts, privateKey, publicKey);

const limit = 20;
const apiUrl = `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}`;

async function fetchMarvelCharacters() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            console.log("Dados recebidos:", data);
            displayCharacters(data.data.results);
        } else {
            console.error("Erro na API:", data);
        }
    } catch (error) {
        console.error('Erro ao buscar personagens:', error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayCharacters(characters) {
    const container = document.getElementById('characters');
    characters.forEach(character => {
        if (character.thumbnail && character.thumbnail.path && !character.thumbnail.path.includes('image_not_available')) {
            const div = document.createElement('div');
            div.className = 'character';

            const img = document.createElement('img');
            img.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
            img.alt = character.name;
            img.loading = 'lazy';

            const name = document.createElement('h3');
            name.textContent = character.name;

            div.appendChild(img);
            div.appendChild(name);
            container.appendChild(div);
        } else {
            console.log(`Personagem sem imagem disponível: ${character.name}`);
        }
    });
}

fetchMarvelCharacters();
