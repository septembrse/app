
import React from 'react';

import Submission from "../model/Submission";
import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ReactMarkdown from 'react-markdown'

import styles from "./Search.module.css";

const gfm = require('remark-gfm');

export function SearchComponent(props){

  let text = props.text;

  const [search_text, setSearchText] = React.useState({text});

  const search_bar = (
    <Row>
      <Col>
        <input key="input" className={styles.searchBar} type="search"
               onChange={(e) => setSearchText(e.target.value)}
               placeholder="Search..." />
      </Col>
    </Row>
  );

  if (search_text === "" || !search_text){
    return (
      <div className={styles.searchpage}>
        {search_bar}
        <div className={styles.message}>
          <div>Type above to search for any of the presentations or events
               taking place as part of #SeptembRSE. Use "all" to see
               all submissions, "talks" to see all talks, "posters" to
               see all posters etc.
          </div>
        </div>
      </div>
    );
  }

  let results = Submission.search(search_text);

  if (results.length === 0){
    return (
      <div className={styles.searchpage}>
        {search_bar}
        <div className={styles.message}>
          No match.
        </div>
      </div>
    );
  }

  let formatted_results = [];

  let i = 0;

  for (let result in results){
    let r = results[result];

    let variant = "primary";

    if (i % 3 === 1){
      variant = "secondary";
    } else if (i % 3 === 2){
      variant = "info";
    }

    i += 1;

    formatted_results.push(
      <Row key={r.getID()}>
        <Col>
          <Card className="text-center"
                bg={variant} border={variant} text={variant}
                key={r.getID()}
                style={{marginTop: "5px", borderRadius: "5px"}}>
            <Card.Header style={{color: "rgb(220,220,220)",
                         fontWeight: "bold"}}>
              {r.getFormat()}: {r.getID()}
            </Card.Header>
            <Card.Body>
              <Card.Title style={{fontSize: "large"}}>
                {r.getTitle()}
              </Card.Title>
              <Card.Title style={{fontSize: "medium", fontWeight: "bold"}}>
                {r.getName()}
              </Card.Title>
              <Card.Title style={{fontSize: "medium", fontStyle: "italic"}}>
                {r.getInstitution()}
              </Card.Title>
              <Card.Text style={{fontSize: "small", textAlign: "left"}}>
                <div className={styles.markdown}>
                  <ReactMarkdown remarkPlugins={[gfm]}
                                children={r.getAbstract()} />
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <div className={styles.searchpage}>
      {search_bar}
      <div className={styles.results}>{formatted_results}</div>
    </div>
  );
}

export function Search(props){

  let [account, setAccount] = React.useState(null);

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <SearchComponent />
    </SimplePage>
  );
}
