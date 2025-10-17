import { useEffect, useState } from "react";
const KEY = "274b361c";
const tittle = "Inception";
const id = "tt3896198";
//http://www.omdbapi.com/?i=tt3896198&apikey=274b361c
export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(tittle);
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedId(id);
  }
  useEffect(() => {
    async function getMovies() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        const data = await response.json();
        setMovies(data.Search || []);
      } catch (error) {
        console.error("Error fetching movies:", error.message);
      } finally {
        setLoading(false);
      }
    }
    getMovies();
  }, [query]);
  return (
    <div>
      <NavBar movies={movies} query={query} setQuery={setQuery} />
      <Main
        movies={movies}
        loading={loading}
        selectedId={selectedId}
        onSelectedMovie={handleSelectedMovie}
      />
    </div>
  );
}
function Loading() {
  return <div className="loader">Loading...</div>;
}
/*NAV-BAR SECTION */
function NavBar({ movies, query, setQuery }) {
  return (
    <div className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <NumResult movies={movies} />
    </div>
  );
}
function Logo() {
  return (
    <div>
      <h1 className="logo">🍿popCORN</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="search"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
function NumResult({ movies = [] }) {
  return (
    <div>
      <p className="num-results">Found {movies.length} result</p>
    </div>
  );
}
/*MAIN SECTION */
function Main({ movies, loading, selectedId, onSelectedMovie }) {
  return (
    <div className="main">
      <List
        movies={movies}
        loading={loading}
        onSelectedMovie={onSelectedMovie}
      />
      <MovieDetail movies={movies} selectedId={selectedId} />
    </div>
  );
}
function List({ movies, loading, onSelectedMovie }) {
  return loading ? (
    <Loading />
  ) : (
    <ul className="list box ">
      {movies.map((movie) => (
        <MovieList
          key={movie.imdbID}
          movie={movie}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}
function MovieList({ movie, onSelectedMovie }) {
  return (
    <div onClick={() => onSelectedMovie(movie.imdbID)}>
      <li className="list-movies">
        <h3 className="">{movie.Title}</h3>
        <img src={movie.Poster} alt={movie.Title} />
        <p>🗓️{movie.Year}</p>
      </li>
    </div>
  );
}
function MovieDetail({ selectedId }) {
  return (
    <div className="box details">
      {selectedId ? <SummaryDetail selectedId={selectedId} /> : <Summary />}
    </div>
  );
}

function Summary() {
  return (
    <div className="summary">
      <h2>MOVIES YOU WATCHED</h2>
      <div className="summary-stat">
        <p>#️⃣0 movies</p>
        <p>⭐ 0.00</p>
        <p>🌟 0.00</p>
        <p>⏳0 min</p>
      </div>
    </div>
  );
}
function SummaryDetail({ selectedId }) {
  const [movie, setMovie] = useState({});
  const {
    Title: title,
    Runtime: runtime,
    Year: year,
    Released: released,
    Writer: writer,
    imdbRating,
    Poster: poster,
    Genre: genre,
    Plot: plot,
    Language: language,
    Actor: actor,
    Director: director,
  } = movie;
  useEffect(() => {
    async function getMovieDetail() {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await response.json();
      console.log(data);
      setMovie(data);
    }
    getMovieDetail();
  }, [selectedId]);
  return (
    <div className="details">
      <header>
        <img src={poster} alt={title} />
        <div className="details-overvies">
          <h2>{title}</h2>
          <p>
            {released} &middot; {runtime}
          </p>
          <p>{genre}</p>
          <p>⭐ {imdbRating} IMDb rating</p>
        </div>
      </header>
      <section>
        <em>{plot}</em>
        <p>{actor}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
