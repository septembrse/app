
import React from 'react';

import Submission from "../model/Submission";

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
    return (<div className={styles.searchpage}>
      {search_bar}
      <div className={styles.message}>
        Results will appear here.
      </div>
    </div>);
  }

  let results = Submission.search(search_text);

  if (results.length === 0){
    return <div className={styles.searchpage}>
      {search_bar}
      <div className={styles.message}>
        No match.
      </div>
    </div>;
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

  return <div className={styles.searchpage}>
          {search_bar}
          <div className={styles.results}>{formatted_results}</div>
         </div>;
}

export default Search;
