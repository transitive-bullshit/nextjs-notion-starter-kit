import React, { useState } from 'react';
import styles from './styles.module.css';

const FeedbackForm = ({ courseName }) => {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState(null);            // ← new
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await fetch('/api/append-course-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName, ...formData }),
      });

      if (!res.ok) throw new Error((await res.json()).message);
      setStatus('success');
      setFormData({ name: '', email: '', comment: '' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const iconStyle = {
    marginRight: '6px',
    background: '#E5E1D3',
    borderRadius: '100%',
    padding: '5px'
  };

  return (
    <div className={styles.FeedbackFormContainer}>
      {!showForm ? (
        <div className={styles.FeedbackFormCard}>
          <div className={styles.FeedbackFormHeader}>Any Feedback?</div>
          <div className={styles.FeedbackFormBody}>
            <p>
              Sending positive and detailed comments helps encourage professors to publish more course notes :)
            </p>
            <button className={styles.FeedbackFormCommentBtn} onClick={() => setShowForm(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 13" fill="none" style={iconStyle}>
                <path d="M10.875 4.85889C10.875 4.65997 10.796 4.46921 10.6553 4.32856C10.5147 4.1879 10.3239 4.10889 10.125 4.10889H8.625V2.60889C8.625 2.40997 8.54598 2.21921 8.40533 2.07856C8.26468 1.9379 8.07391 1.85889 7.875 1.85889H1.875C1.67609 1.85889 1.48532 1.9379 1.34467 2.07856C1.20402 2.21921 1.125 2.40997 1.125 2.60889V8.60889C1.1248 8.6799 1.14502 8.74946 1.18325 8.8093C1.22148 8.86914 1.27611 8.91673 1.34063 8.94639C1.40381 8.97727 1.47457 8.98928 1.54441 8.98096C1.61425 8.97265 1.68021 8.94437 1.73438 8.89951L3.375 7.57295V8.98389C3.375 9.1828 3.45402 9.37357 3.59467 9.51422C3.73532 9.65487 3.92609 9.73389 4.125 9.73389H8.5125L10.2656 11.1495C10.3198 11.1944 10.3858 11.2227 10.4556 11.231C10.5254 11.2393 10.5962 11.2273 10.6594 11.1964C10.7239 11.1667 10.7785 11.1191 10.8168 11.0593C10.855 10.9995 10.8752 10.9299 10.875 10.8589V4.85889ZM8.87813 9.06826C8.81249 9.01322 8.72941 8.98331 8.64375 8.98389H4.125V7.48389H7.875C8.07391 7.48389 8.26468 7.40487 8.40533 7.26422C8.54598 7.12356 8.625 6.9328 8.625 6.73389V4.85889H10.125V10.0714L8.87813 9.06826Z" fill="#111928"/>
              </svg>
              Add Comment
            </button>

            {status === 'success' && (
              <p style={{ color: 'green', marginTop: '10px' }}>Thanks for your feedback!</p>
            )}
            {status === 'error' && (
              <p style={{ color: 'red' }}>
                Sorry, something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.FeedbackFormHeader}>Send Course Feedback</div>
          <form className={styles.FeedbackFormForm} onSubmit={handleSubmit}>
            <label>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 17 17" fill="none" style={iconStyle}>
                        <path d="M14.7 3.60096L8.65811 1.58699C8.55559 1.55544 8.44595 1.55544 8.34342 1.58699L2.30779 3.60096H2.2952L2.23226 3.63243H2.22597L2.16303 3.67019C2.16303 3.67649 2.15674 3.67649 2.15044 3.68278L2.10009 3.72684L2.05604 3.77719C2.05604 3.78348 2.04975 3.78348 2.04975 3.78977L2.01198 3.84642C2.01198 3.85271 2.01198 3.85271 2.00569 3.859L1.98052 3.91565L1.96163 3.98488V4.00376C1.95543 4.02842 1.9533 4.05393 1.95534 4.07928V9.11422C1.95534 9.24776 2.00839 9.37583 2.10281 9.47025C2.19723 9.56467 2.3253 9.61772 2.45883 9.61772C2.59237 9.61772 2.72044 9.56467 2.81486 9.47025C2.90928 9.37583 2.96233 9.24776 2.96233 9.11422V4.77788L5.077 5.48277C4.67972 6.11868 4.47027 6.85394 4.47281 7.60374C4.47304 8.28567 4.6464 8.95637 4.97664 9.553C5.30687 10.1496 5.78318 10.6526 6.36092 11.0149C5.16033 11.4691 4.13538 12.2935 3.43435 13.3688C3.3629 13.4817 3.33869 13.6183 3.36695 13.749C3.3952 13.8796 3.47365 13.994 3.5854 14.0674C3.64024 14.1037 3.70175 14.1288 3.76636 14.1412C3.83097 14.1536 3.89739 14.153 3.96179 14.1395C4.02618 14.1261 4.08726 14.1 4.14149 14.0627C4.19572 14.0255 4.24202 13.9779 4.27771 13.9226C4.73471 13.2186 5.36043 12.6401 6.09798 12.2396C6.83552 11.8391 7.66149 11.6293 8.50077 11.6293C9.34005 11.6293 10.166 11.8391 10.9036 12.2396C11.6411 12.6401 12.2668 13.2186 12.7238 13.9226C12.7698 13.9924 12.8324 14.0496 12.906 14.0892C12.9796 14.1288 13.0619 14.1494 13.1455 14.1492C13.242 14.1502 13.3364 14.1216 13.4161 14.0674C13.5279 13.994 13.6063 13.8796 13.6346 13.749C13.6628 13.6183 13.6386 13.4817 13.5672 13.3688C12.8662 12.2935 11.8412 11.4691 10.6406 11.0149C11.2184 10.6526 11.6947 10.1496 12.0249 9.553C12.3551 8.95637 12.5285 8.28567 12.5287 7.60374C12.5313 6.85394 12.3218 6.11868 11.9245 5.48277L14.7 4.5576C14.8008 4.52449 14.8885 4.46043 14.9507 4.37454C15.0128 4.28865 15.0463 4.18532 15.0463 4.07928C15.0463 3.97325 15.0128 3.86992 14.9507 3.78403C14.8885 3.69814 14.8008 3.63407 14.7 3.60096ZM8.50077 10.6247C7.69956 10.6247 6.93116 10.3064 6.36462 9.73989C5.79808 9.17335 5.4798 8.40495 5.4798 7.60374C5.48101 6.9591 5.68587 6.33133 6.06511 5.81004L8.34342 6.57158C8.44562 6.6052 8.55591 6.6052 8.65811 6.57158L10.9364 5.81004C11.3157 6.33133 11.5205 6.9591 11.5217 7.60374C11.5217 8.40495 11.2035 9.17335 10.6369 9.73989C10.0704 10.3064 9.30198 10.6247 8.50077 10.6247Z" fill="#111928"/>
                    </svg>
                    Name
                </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </label>
            <label>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 17 17" fill="none" style={iconStyle}>
                        <path d="M14.5424 3.07227H2.45857C2.32504 3.07227 2.19697 3.12531 2.10255 3.21974C2.00812 3.31416 1.95508 3.44222 1.95508 3.57576V12.1352C1.95508 12.4022 2.06117 12.6584 2.25002 12.8472C2.43887 13.0361 2.695 13.1422 2.96207 13.1422H14.0389C14.306 13.1422 14.5621 13.0361 14.751 12.8472C14.9398 12.6584 15.0459 12.4022 15.0459 12.1352V3.57576C15.0459 3.44222 14.9929 3.31416 14.8985 3.21974C14.804 3.12531 14.676 3.07227 14.5424 3.07227ZM14.0389 12.1352H2.96207V4.72121L8.16065 9.48552C8.25346 9.57044 8.3747 9.61753 8.5005 9.61753C8.6263 9.61753 8.74754 9.57044 8.84036 9.48552L14.0389 4.72121V12.1352Z"  fill="#111928"/>
                    </svg>
                    Email
                </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Sending positive and detailed comments helps encourage professors to publish more course notes :)"
              required
            />
            <div className={styles.submitButtonRow}>
                <button type="submit" className={styles.FeedbackFormSubmitBtn}>→</button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
