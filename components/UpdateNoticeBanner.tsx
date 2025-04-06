import * as React from 'react';
import styles from './styles.module.css'; // ensure this file includes the CSS below

export const UpdateNoticeBanner: React.FC = () => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div className={styles.UpdateNoticeBanner}>
      <div>
        <span className={styles.cursive}>🌱 We are always updating Coursetexts. </span>
        These notes are drafts and meant to be more up-to-date than they are polished.
        If you spot a typo, please let us know at <a target="_blank" rel="noopener noreferrer" href="mailto:coursetexts@mit.edu" >coursetexts@mit.edu</a>!
      </div>

      <button
        className={styles.closeButton}
        onClick={() => setVisible(false)}
        aria-label="Close banner"
      >
        ×
      </button>
    </div>
    
  );
};
