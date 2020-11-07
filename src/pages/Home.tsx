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
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { get, map, truncate } from "lodash-es";
import axios from 'axios';
import "./Home.css";

function stripTags(html: string): string {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const url = 'https://api.stackexchange.com/2.2/questions?order=desc&sort=hot&site=stackoverflow&filter=withbody';

const Home: React.FC = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(url)
      .then(res => res.data)
      .then(data => setQuestions(q => q.concat(get(data, 'items', []))))
      .catch(err => console.error(err))
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
              <IonRouterLink href={get(q, "owner.link", "#")} target="_blank">
                <IonChip>
                  <IonAvatar>
                    <img
                      src={get(q, "owner.profile_image")}
                      alt={get(q, "owner.display_name")}
                    />
                  </IonAvatar>
                  <IonLabel>{get(q, "owner.display_name")}</IonLabel>
                </IonChip>
              </IonRouterLink>
              <IonLabel>{get(q, "title")}</IonLabel>
              <IonButton fill="outline" slot="end">
                View
              </IonButton>
            </IonItem>

            <IonCardContent>
              <p>{truncate(stripTags(get(q, "body")), { length: 400 })}</p>

              <p>
                {map(get(q, "tags", []), (tag) => (
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
            </IonCardContent>
          </IonCard>
        ))}

        {loading && (
          <div style={{ display: 'flex' }} className="ion-margin ion-justify-content-center">
            <IonSpinner />
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Home;
