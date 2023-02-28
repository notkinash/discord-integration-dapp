import styles from "../styles/Home.module.css";
import DiscordComponent from "../components/DiscordComponent";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <ToastContainer />
        <DiscordComponent></DiscordComponent>
      </main>
    </div>
  );
}