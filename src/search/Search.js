
import React from 'react';

import Submission from "../model/Submission";
import SimplePage from "../SimplePage";

import ReactMarkdown from 'react-markdown'

import styles from "./Search.module.css";

const gfm = require('remark-gfm');

const Search = ({text = ""}) => {

  const [search_text, setSearchText] = React.useState({text});

  const search_bar = (
    <input key="input" className={styles.searchBar} type="search"
           onChange={(e) => setSearchText(e.target.value)}
           placeholder="Search..." />
    );

  if (search_text === "" || !search_text){
    return (
      <SimplePage>
        {search_bar}
        <div className={styles.message}>
          <div>Type above to search for any of the presentations or events
               taking place as part of #SeptembRSE. Use "all" to see
               all submissions, "talks" to see all talks, "posters" to
               see all posters etc.
          </div>
        </div>
      </SimplePage>
    );
  }

  let results = Submission.search(search_text);

  if (results.length === 0){
    return (
      <SimplePage>
        {search_bar}
        <div className={styles.message}>
          No match.
        </div>
        </SimplePage>
    );
  }

  let formatted_results = [];

  for (let result in results){
    let r = results[result];

    formatted_results.push(
      <div className={styles.result} key={r.getID()}>
        <div className={styles.sformat}>{r.getFormat()}: {r.getID()}</div>
        <div className={styles.title}>{r.getTitle()}</div>
        <div className={styles.name}>{r.getName()}</div>
        <div className={styles.institution}>{r.getInstitution()}</div>
        <div className={styles.markdown}><ReactMarkdown remarkPlugins={[gfm]} children={r.getAbstract()} /></div>
      </div>
    )
  }

  return (
    <SimplePage>
      {search_bar}
      <div className={styles.results}>{formatted_results}</div>
    </SimplePage>
  );
}

export default Search;
