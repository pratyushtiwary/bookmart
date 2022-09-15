import styles from "./index.module.css";

export default function Overlay({
  intensity,
  invert,
  className,
  leaveControl,
  fixed,
}) {
  return (
    <div
      style={{
        opacity: !leaveControl && (intensity || 0.5),
        filter: invert && "invert(1)",
        position: fixed && "fixed",
      }}
      className={styles.overlay + " " + className}
    ></div>
  );
}
