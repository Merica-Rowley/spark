import { useNavigate } from "react-router-dom";
import { HiHome, HiChevronLeft } from "react-icons/hi2";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p className={styles.errorCode}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.description}>
          The page you're looking for may have been moved, deleted, or never
          existed.
        </p>
        <div className={styles.actions}>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            <HiChevronLeft size={18} />
            Go Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/lists")}
          >
            <HiHome size={18} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
