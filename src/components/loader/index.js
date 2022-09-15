import { CircularProgress, Typography } from "@mui/material";
import styles from "./index.module.css";

export default function Loader({ fullScreen, visible }) {
  return (
    <>
      {visible && (
        <div
          className={styles.loader + " " + (fullScreen && styles.fullScreen)}
        >
          <div className={styles.opacity}></div>
          <div className={styles.container}>
            <div className={styles.child}>
              <CircularProgress />
              <Typography variant="h5" className={styles.loadingTxt}>
                Loading...
              </Typography>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
