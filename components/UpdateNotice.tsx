import * as React from 'react';
import "@fontsource/tobias"; // Ensure Tobias is available
import "@fontsource/untitled-sans"; // Ensure UntitledSans is available

export const UpdateNotice: React.FC = () => {
  return (
    <div style={styles.UpdateParent}>
      <h1 style={styles.heading}>
        <span style={styles.smallText}>s</span> We are always updating <span style={styles.cursive}>Coursetexts.</span>
      </h1>
      <p style={styles.paragraph}>
        These notes are drafts and meant to be more up-to-date than they are polished. If you spot a typo, please let us know at coursetexts@mit.edu!
      </p>
      <button style={styles.button}>Learn more →</button>
    </div>
  );
};

const styles = {
  UpdateParent: {
    backgroundColor: "black",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    maxWidth: "900px",
    margin: "auto",
  },
  heading: {
    fontSize: "2rem",
    fontFamily: "UntitledSans, sans-serif",
    fontWeight: "bold",
  },
  cursive: {
    fontFamily: "Tobias, cursive",
  },
  smallText: {
    fontSize: "0.5rem",
    verticalAlign: "super",
  },
  paragraph: {
    fontSize: "1rem",
    fontFamily: "UntitledSans, sans-serif",
  },
  button: {
    border: "1px solid white",
    backgroundColor: "transparent",
    color: "white",
    padding: "10px 20px",
    fontSize: "1rem",
    fontFamily: "UntitledSans, sans-serif",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  }
};
