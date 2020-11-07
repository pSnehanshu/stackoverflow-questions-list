import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonItem,
  IonChip,
  IonAvatar,
  IonLabel,
  IonButton,
  IonCardContent,
  IonRouterLink,
  IonSpinner,
  IonModal,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { get, map, truncate, toSafeInteger } from "lodash-es";
import axios from "axios";
import ago from "s-ago";
import "./Home.css";

function stripTags(html: string): string {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function getTimeAgo(timestamp: number): string {
  return ago(new Date(toSafeInteger(timestamp) * 1000));
}

const url =
  "https://api.stackexchange.com/2.2/questions?order=desc&sort=hot&site=stackoverflow&filter=withbody";

function UserAvatar({ user }: any) {
  return (
    <IonRouterLink href={get(user, "link", "#")} target="_blank">
      <IonChip>
        <IonAvatar>
          <img
            src={get(user, "profile_image")}
            alt={get(user, "display_name")}
          />
        </IonAvatar>
        <IonLabel>{get(user, "display_name")}</IonLabel>
      </IonChip>
    </IonRouterLink>
  );
}

function Tags({ tags }: any) {
  return (
    <p>
      {map(tags, (tag) => (
        <a
          href={`https://stackoverflow.com/questions/tagged/${tag}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ion-margin-end"
        >
          #{tag}
        </a>
      ))}
    </p>
  );
}

const Home: React.FC = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailedQuestion, setDetailedQuestion] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => res.data)
      .then((data) => setQuestions((q) => q.concat(get(data, "items", []))))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [setLoading]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Stackoverflow</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>

        {map(questions, (q) => (
          <IonCard key={get(q, "question_id")}>
            <IonItem>
              <UserAvatar user={get(q, "owner")} />
              <IonLabel
                style={{ cursor: "pointer" }}
                onClick={() => setDetailedQuestion(q)}
              >
                {stripTags(get(q, "title", ""))}
              </IonLabel>
              <IonButton
                fill="outline"
                slot="end"
                onClick={() => setDetailedQuestion(q)}
              >
                View
              </IonButton>
            </IonItem>

            <IonCardContent>
              <p>
                <small>
                  <b>{getTimeAgo(get(q, "creation_date", 0))}</b>
                </small>{" "}
                {truncate(stripTags(get(q, "body")), { length: 400 })}
              </p>
              <small>
                <Tags tags={get(q, "tags")} />
              </small>
            </IonCardContent>
          </IonCard>
        ))}

        {loading && (
          <div
            style={{ display: "flex" }}
            className="ion-margin ion-justify-content-center"
          >
            <IonSpinner />
          </div>
        )}

        <IonModal
          isOpen={!!detailedQuestion}
          cssClass="my-custom-class"
          onDidDismiss={() => setDetailedQuestion(null)}
        >
          <IonContent className="ion-padding">
            <h1>{stripTags(get(detailedQuestion, "title", ""))}</h1>

            <UserAvatar user={get(detailedQuestion, "owner")} />

            <div className="ion-margin-vertical">
              <small>
                {getTimeAgo(get(detailedQuestion, "creation_date", 0))},
                Answers: {get(detailedQuestion, "answer_count", 0)}, Score:{" "}
                {get(detailedQuestion, "score", 0)}
              </small>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: get(detailedQuestion, "body", ""),
              }}
            />

            <small>
              <Tags tags={get(detailedQuestion, "tags")} />
            </small>

            <div
              style={{ display: "flex" }}
              className="ion-margin ion-justify-content-center"
            >
              <IonButton
                fill="clear"
                color="danger"
                onClick={() => setDetailedQuestion(null)}
              >
                Close
              </IonButton>
              <IonButton
                href={get(detailedQuestion, "link", "#")}
                target="_blank"
              >
                Go to Stackoverflow
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
