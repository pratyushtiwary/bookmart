import { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Head from "components/head";
import Header from "components/header";
import styles from "./index.module.css";
import Overlay from "components/overlay";
import Loader from "components/loader";
import useRequest from "components/hooks/useRequest";
import { APPNAME } from "components/globals";
import { useEffect } from "react";

export default function Recommend(props) {
  const [loading, setLoading] = useState(true);
  const [recommendations, makeRecommendationRequest] =
    useRequest("/api/recommend");

  useEffect(() => {
    const books = window.localStorage.getItem("books");
    if (books) {
      try {
        makeRecommendationRequest({
          books: JSON.parse(books),
        });
      } catch (e) {
        window.location.href = "/";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendations]);

  function reset() {
    window.localStorage.setItem("books", undefined);
    window.location.href = "/";
  }

  return (
    <>
      <Head>
        <title>Recommendations - {APPNAME}</title>
      </Head>
      <Loader visible={loading} fullScreen />
      <Header />
      <Overlay intensity={0.75} fixed />
      <section className={styles.section}>
        <Typography variant="h6" className={styles.title}>
          Recommendations
        </Typography>
        <div className={styles.books}>
          {recommendations?.recommendations?.map((e, i) => (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              key={i}
            >
              <Card className={styles.book}>
                <CardActionArea className={styles.bookInner}>
                  <CardMedia
                    component="img"
                    height="226"
                    image={e.ImageURL_L}
                    alt={"Cover of " + e.Title}
                  />
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
        </div>
      </section>
      <Button onClick={reset} className={styles.fab} variant="contained">
        Reset
      </Button>
    </>
  );
}
