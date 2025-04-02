import * as React from 'react';
import styles from './styles.module.css';

export const UpdateNotice: React.FC = () => {
  return (
    <div className={styles.UpdateParent}>
      <div>
        <h1>
          <span className={styles.cursive}>🌱 We are always updating Coursetexts.</span>
        </h1>
        <p>
          These notes are drafts and meant to be more up-to-date than they are polished. If you spot a typo, please let us know at coursetexts@mit.edu!
        </p>
      </div>
      <button className={styles.button}>Learn more →</button>
    </div>
  );
};