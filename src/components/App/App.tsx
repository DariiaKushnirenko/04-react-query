import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "../App/App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery <{
    results: Movie[];
    totalPages: number;
  }>({
    queryKey: ["results", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request :(");
    }
  }, [data]);

  const handleSearch = (newQuery: string) => {
    const trimmedQuery = newQuery.trim();
    if (trimmedQuery === "") {
      toast.error("Please enter a search query.");
      return;
    }
    setQuery(newQuery);
    setCurrentPage(1);
    };

    const handleSelectMovie = (movie: Movie) => {
      setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
      setSelectedMovie(null);
    };

    return (
      <div>
        <SearchBar onSubmit={handleSearch} />
        {isSuccess && data && data.totalPages > 1 && (
          <ReactPaginate
            pageCount={data.totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && data && (
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    );
  };

