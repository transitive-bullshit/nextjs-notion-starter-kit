import * as React from 'react';
import styles from './styles.module.css';

export const UpdateNoticeBanner: React.FC = () => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const storedValue = localStorage.getItem('updateNoticeDismissed');
    if (storedValue === 'true') {
      setVisible(false);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('updateNoticeDismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className={styles.UpdateNoticeBanner}>
      <div> </div>
      <div>
        <span className={styles.cursive}>🌱 We are always updating Coursetexts. </span>
        These notes are drafts and meant to be more up-to-date than they are polished.
        If you spot a typo, please let us know at <a target="_blank" rel="noopener noreferrer" href="mailto:coursetexts@mit.edu" >coursetexts@mit.edu</a>!
      </div>

      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close banner"
      >
        ×
      </button>
    </div>
  );
};
