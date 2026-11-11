import { useEffect, useState } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [movies, setMovies] = useState([]);

  // Liked movies
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find((movie) => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className='likedMovie'>{data}</span>
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={() => updateLikedMovies(data)}
          className={styles.crossIcon}
        />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>{likedMoviesPopover}</div>
  );

  // Movies list
  useEffect(() => {
    fetch('https://backend-moviz5.vercel.app/movies')
      .then((response) => response.json())
      .then((data) => {
        setMoviesData(data);
      });
  }, []);
  // useEffect(() => {
  //   fetch('https://backend-moviz5.vercel.app/movies')
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`Erreur HTTP : ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log('Réponse API :', data);
  //       setMovies(Array.isArray(data.movies) ? data.movies : []);
  //     })
  //     .catch((error) => console.error('Erreur fetch :', error));
  // }, []);

  const moviesList = movies.map((data, i) => {
    const isLiked = likedMovies.some((movie) => movie === data.title);

    let overview = data.overview || '';
    if (overview.length > 250) {
      overview = overview.slice(0, 250) + '...';
    }

    return (
      <Movie
        key={data.id}
        updateLikedMovies={updateLikedMovies}
        isLiked={isLiked}
        title={data.title}
        overview={overview}
        poster={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
        voteAverage={data.vote_average}
        voteCount={data.vote_count}
      />
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src='logo.png' alt='Logo' />
          <img className={styles.logo} src='logoletter.png' alt='Letter logo' />
        </div>

        <Popover
          title='Liked movies'
          content={popoverContent}
          className={styles.popover}
          trigger='click'
        >
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>

      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>{moviesList}</div>
    </div>
  );
}

export default Home;
