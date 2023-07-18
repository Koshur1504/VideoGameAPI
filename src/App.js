import "./styles.css";
import { useState } from "react";
import useSWR from "swr";

export default function App() {
  const [gameTitle, setGameTitle] = useState("");
  const url = `https://www.cheapshark.com/api/1.0/games?title=${gameTitle}&limit=3`;
  const url1 = `https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=20&pageSize=3`;
  const [searchedGames, setSearchedGames] = useState([]);
  const fetcher = (...args) => {
    return fetch(...args).then((res) => res.json());
  };
  const { data } = useSWR(url1, fetcher);

  function searchGame(e) {
    if (!e.target.value) {
      setGameTitle("");
      setSearchedGames([]);
    }
    if (e.target.value) {
      setGameTitle(e.target.value);

      fetch(url)
        .then((res) => res.json())
        .then((d) => {
          setSearchedGames(d);
        });
    }
    console.log(searchedGames);
  }
  const clickHandler = (game) => {
    console.log(game);
    if (!game.steamAppID) {
      window.open(`https://www.cheapshark.com/search#q:${game.external}`);
    }
    if (game.steamAppID) {
      window.open(
        `http://store.steampowered.com/app/${game.steamAppID}/`,
        "_blank"
      );
    }
  };
  return (
    <div className="App">
      <div className="searchSection">
        <h1>Search For A Game</h1>
        <input
          type="text"
          value={gameTitle}
          placeholder="Minecraft..."
          onChange={(e) => searchGame(e)}
        />
        <div className="games">
          {searchedGames.map((game, key) => {
            return (
              <div
                onClick={() => clickHandler(game)}
                key={key}
                className="game"
              >
                <p>{game.external}</p>
                <img src={game.thumb} alt="" />
                {game.cheapest}
              </div>
            );
          })}
        </div>
      </div>
      <div className="dealsSection">
        <h1>
          Latest Deals
          <span role="img" aria-label="Fire">
            🔥
          </span>
        </h1>
        <div className="games">
          {data &&
            data.map((game, key) => {
              return (
                <div
                  className="game"
                  id="deals"
                  key={key}
                  onClick={() => {
                    clickHandler(game);
                  }}
                >
                  <h3>{game.title}</h3>
                  <img src={game.thumb} />
                  <p>Normal Price:{game.normalPrice}</p>
                  <p>Deal Price:{game.salePrice}</p>
                  <h3>You Save: {game.savings.substr(0, 2)}%</h3>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
