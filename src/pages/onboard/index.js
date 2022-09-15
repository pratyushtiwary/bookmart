import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Checkbox,
  Icon,
  Button,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Head from "components/head";
import Header from "components/header";
import Overlay from "components/overlay";
import styles from "./index.module.css";
import { APPNAME } from "components/globals";
import Input from "components/input";
import Loader from "components/loader";
import useRequest from "components/hooks/useRequest";

let last = 0;
const offset = 10;
let lastOpr = "f";
let timeout = null;

export default function Onboard(props) {
  const maxWidth = useMediaQuery("(max-width: 864px)");
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [newBooks, makeBookFetchingRequest] = useRequest("/api/books");
  const [searchedBooks, makeSearchBookFetchingRequest] =
    useRequest("/api/search");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    makeBookFetchingRequest({
      last: last,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newBooks?.results && books.length !== last + offset) {
      if (loading === true) {
        setLoading(false);
      }

      if (loadingMore === true) {
        setLoadingMore(false);
      }
      setBooks((oldBooks) => [...oldBooks, ...newBooks.results]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newBooks]);

  useEffect(() => {
    if (last === 0 && searchedBooks?.results) {
      setBooks([...searchedBooks.results]);
    } else if (searchedBooks?.results && books.length !== last + offset) {
      setBooks((oldBooks) => [...oldBooks, ...searchedBooks.results]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedBooks]);

  const toggleSelected = (i) => () => {
    console.log(i);
    setSelected((oldSelected) => {
      oldSelected[i] = !oldSelected[i];
      return [...oldSelected];
    });
  };

  function loadMore() {
    last = books.pop().ID;
    if (lastOpr === "s") {
      makeSearchBookFetchingRequest({
        term: searchTerm,
        last: last,
      });
    } else {
      makeBookFetchingRequest({
        last: last,
      });
    }
  }

  function search(e) {
    setSearchTerm(e.target.value);
    if (lastOpr === "f") {
      last = 0;
    }

    if (e.target.value.replace(" ", "") === "") {
      lastOpr = "f";
      makeBookFetchingRequest({
        last: last,
      });
    } else {
      lastOpr = "s";
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        makeSearchBookFetchingRequest({
          term: e.target.value,
          last: last,
        });
      });
    }
  }

  function next() {
    const names = [];
    selected.forEach((e, i) => {
      if (e) {
        names.push(books[i].Title);
      }
    });
    window.localStorage.setItem("books", JSON.stringify(names));
    window.location.href = "/recommend";
  }

  return (
    <>
      <Head>
        <title>Onboard - {APPNAME}</title>
      </Head>
      <Loader visible={loading} fullScreen />
      <Header />
      <Overlay intensity={0.75} fixed />
      <section className={styles.section}>
        <Typography variant="h6" className={styles.title}>
          Pick atleast 3 books of your likings
        </Typography>
        <div className={styles.books}>
          {books.map((e, i) => (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              key={i}
            >
              <Card className={styles.book} onClick={toggleSelected(i)}>
                <CardActionArea className={styles.bookInner}>
                  <CardMedia
                    component="img"
                    height="226"
                    image={e.ImageURL_L}
                    alt={"Cover of " + e.Title}
                  />
                  <Checkbox
                    checked={Boolean(selected[i])}
                    onChange={toggleSelected(i)}
                    className={styles.checkbox}
                    sx={{
                      color: "#ceb900",
                      "&.Mui-checked": {
                        color: "#ceb900",
                      },
                    }}
                  />
                  <Overlay className={styles.overlay} leaveControl />
                  <CardContent>
                    <Typography variant="h4" className={styles.bookTitle}>
                      {e.Title}
                    </Typography>
                    <Typography variant="h5" className={styles.bookAuthor}>
                      {e.Author}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          ))}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: books.length * 0.15,
            }}
          >
            <Card className={styles.book + " " + styles.loadMore}>
              <CardActionArea
                className={styles.bookInner}
                onClick={loadMore}
                loading={loadingMore}
              >
                <CardContent>
                  <Typography variant="h4" className={styles.bookTitle}>
                    +
                  </Typography>
                  <Typography variant="h5" className={styles.bookAuthor}>
                    Load More
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </motion.div>
        </div>
        <AnimatePresence>
          {selected.filter((e) => Boolean(e)).length > 0 && (
            <motion.div
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              className={styles.selectedCountParent}
            >
              <div className={styles.selectedCount}>
                <Typography variant="subtitle1">
                  {selected.filter((e) => Boolean(e)).length} book(s) selected
                </Typography>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={styles.bottom}>
          <Input
            value={searchTerm}
            type="search"
            placeholder="Search..."
            left={<Icon>search</Icon>}
            className={styles.search}
            onChange={search}
          />
          {!maxWidth && (
            <img
              src="/assets/bottom.png"
              alt="Books Illustration"
              className={styles.bottomImg}
            />
          )}

          <Button
            className={styles.continueBtn}
            variant="outlined"
            onClick={next}
          >
            Continue {">"}
          </Button>
        </div>
      </section>
    </>
  );
}
