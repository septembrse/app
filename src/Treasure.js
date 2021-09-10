
import React from 'react';


import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { useParams } from 'react-router-dom';


export function Treasure(props){

  let { code } = useParams();

  console.log(code)

  return (
    <div>Hello {code}</div>
  );
}
