import { Col } from "react-bootstrap";

import styles from "./page.module.scss";
// import { getSession } from "@auth0/nextjs-auth0";

export default async function Home() {
  // const session = await getSession();

  return (
    <main className={styles.main}>
      <div className="px-4 py-5 mb-5 text-center">
        <h1 className="display-5 fw-bold">Evermyth</h1>
        <Col lg="6" className="mx-auto">
          <p className="lead mb-4">Tools for the Evermyth system.</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a href="/api/auth/login">
              <button
                type="button"
                className="btn btn-primary btn-lg px-4 gap-3"
              >
                Sign up
              </button>
            </a>
            <a href="/api/auth/login">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg px-4"
              >
                Log in
              </button>
            </a>
          </div>
        </Col>
      </div>
    </main>
  );
}
