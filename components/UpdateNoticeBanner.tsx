import * as React from 'react';
import styles from './styles.module.css'; // ensure this file includes the CSS above

export const UpdateNoticeBanner: React.FC = () => {
  return (
    <div className={styles.updateNoticeBanner}>
      <div>
        <h1>
          <span className={styles.cursive}>🌱 We're always updating Coursetexts.</span>
        </h1>
        <p>
          These notes are drafts and meant to be more up-to-date than they are polished. If you spot a typo, please let us know at coursetexts@mit.edu!
        </p>
      </div>
      <button className={styles.button}>Learn more →</button>
    </div>
  );
};
