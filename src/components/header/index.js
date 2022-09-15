import {
  AppBar,
  Toolbar,
  Typography,
  Slide,
  useScrollTrigger,
  useMediaQuery,
} from "@mui/material";
import styles from "./index.module.css";

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header(props) {
  const maxWidth = useMediaQuery("(max-width: 864px)");

  return (
    <HideOnScroll {...props}>
      <AppBar>
        <Toolbar className={styles.toolbar}>
          {!maxWidth && (
            <img
              src="/assets/banner_logo.png"
              alt="Bookmart Banner"
              className={styles.bannerImg}
            />
          )}

          {!maxWidth && (
            <Typography
              variant="h4"
              component="div"
              className={styles.bannerTxt}
            >
              welcome to, book-mart
            </Typography>
          )}

          {maxWidth && (
            <Typography
              variant="h6"
              component="div"
              className={styles.bannerTxt}
            >
              welcome to, book-mart
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
