import './App.css'
import { useState } from "react";

const History = ({ array }) => {
  return (
    <div className="history">
      <h1>History</h1>
      {array.length > 0 ? (
        <ul>
          {array.map((pokemon, index) => (
            <li key={index}>{pokemon.name}</li>
          ))}
        </ul>
      ) : (
        <p>No Pokémon fetched yet</p>
      )}
    </div>
  );
};

const BanList = ({ banlist, removeBan }) => {
  return (
    <div className="banlist">
      <h1>Ban List</h1>
      {banlist.length > 0 ? (
        <ul>
          {banlist.map((type, index) => (
            <li key={index}>
              {type} <button onClick={() => removeBan(type)}>X</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No banned types yet</p>
      )}
    </div>
  );
};

const Card = ({ pokemon, banList, banlist }) => {
  if (!pokemon || !pokemon.types) {
    return <p>No Pokémon selected yet</p>;
  }

  const filteredTypes = pokemon.types.filter(
    (typeObj) => !banlist.includes(typeObj.type.name)
  );

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <div>
        {filteredTypes.length > 0 ? (
          filteredTypes.map((typeObj, index) => (
            <button key={index} onClick={() => banList(typeObj.type.name)}>
              {typeObj.type.name}
            </button>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

const Button = ({ onClick, data, banList, banlist }) => {
  return (
    <>
      <button onClick={onClick}>Click for Pokémon</button>
      <Card pokemon={data} banList={banList} banlist={banlist} />
    </>
  );
};

function App() {
  const callAPI = async () => {
    let randomNumber = getRandomNumberInRange(1, 1025);
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/" + randomNumber
    );
    const json = await response.json();
    return json;
  };

  const [pokemon, setPokemon] = useState(null);
  const [history, setHistory] = useState([]);
  const [banlist, setBanlist] = useState([]);

  const handleClick = async () => {
    let fetchedPokemon = await callAPI();
    let filteredTypes = fetchedPokemon.types.filter(
      (typeObj) => !banlist.includes(typeObj.type.name)
    );

    while (filteredTypes.length === 0) {
      fetchedPokemon = await callAPI();
      filteredTypes = fetchedPokemon.types.filter(
        (typeObj) => !banlist.includes(typeObj.type.name)
      );
    }

    setPokemon(fetchedPokemon);
    setHistory((prevHistory) => [...prevHistory, fetchedPokemon]);
  };

  const banList = (type) => {
    if (!banlist.includes(type)) {
      setBanlist((prevBanlist) => [...prevBanlist, type]);
    }
  };

  const removeBan = (type) => {
    setBanlist((prevBanlist) =>
      prevBanlist.filter((bannedType) => bannedType !== type)
    );
  };

  function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <div className="App">
      <History array={history} />
      <div className="container">
        <h1>Random Pokémon</h1>
        <Button
          onClick={handleClick}
          data={pokemon}
          banList={banList}
          banlist={banlist}
        />
      </div>
      <BanList banlist={banlist} removeBan={removeBan} />
    </div>
  );
}

export default App;
