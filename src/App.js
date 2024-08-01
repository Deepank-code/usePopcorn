import { useEffect, useState } from "react";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const NavBar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};
const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};
const NumResult = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong></strong> results
    </p>
  );
};
const Search = ({ query, setQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
};

const MovieList = ({ movies, onSelectMovie }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
};
const Movie = ({ movie, onSelectMovie }) => {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

const MovieSummary = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};
const WatchedMovieList = ({ watched }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.Title} />
      ))}
    </ul>
  );
};

const WatchedMovie = ({ movie }) => {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
};
function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
function MovieDetail({ selectedId, onCloseMovies }) {
  useEffect(() => {
    async function getMovieDetail() {
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedId}&apikey=84f4e993`
        );

        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getMovieDetail();
  }, [selectedId]);
  return (
    <div className="details">
      <button className="btn-back" onClick={onCloseMovies}>
        &larr;
      </button>
      {selectedId}
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setisLoading] = useState("false");
  const [query, setQuery] = useState("Interstellar");
  const [selectedId, setSelectedId] = useState(null);

  const [error, seterror] = useState();
  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  useEffect(() => {
    async function fetchMovies() {
      try {
        setisLoading(true);
        seterror("");
        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=84f4e993&s=${query}`
        );

        if (!res.ok) throw new Error("Something went wrong...");
        const data = await res.json();

        if (data.Response === "False") throw new Error("Movies not found...");
        console.log(data.Search);
        setMovies(data.Search);
      } catch (error) {
        seterror(error.message);
      } finally {
        setisLoading(false);
      }
    }
    if (query.length <= 3) {
      setMovies([]);
      seterror("");
      return;
    }
    fetchMovies();
  }, [query]);

  return (
    <>
      <NavBar movies={movies}>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage message={error} />}
          {!movies && "Enter movie that you want to search"}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              onCloseMovies={handleCloseMovie}
            />
          ) : (
            <>
              <MovieSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
