
import React from 'react';

import Account from '../model/Account';
import SimplePage from '../SimplePage';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const tracks = [
  {
    url: "https://siremol.org/largefiles/music/001.mp3",
    title: "Honeyknocker Meadows",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/into-the-ether/honeyknocker-meadows",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/002.mp3",
    title: "Let's go up",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/the-happy-puppy-collection/lets-go-up",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/003.mp3",
    title: "Gaily into the ether",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/into-the-ether/gaily-into-the-ether",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/004.mp3",
    title: "Quare Frolic",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/the-chiptunes-win-compilation-tracks-reissue/quare-frolic",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  }
];

export function getTracks(){
  return tracks;
}

export function Music(props){

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  let t = [];

  let variant = "secondary";

  for (let i in tracks){
    let track = tracks[i];

    if (variant === "secondary"){
      variant = "primary";
    } else {
      variant = "secondary";
    }

    t.push(
      <Row key={i} >
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <Card className="text-center"
                bg={variant} border={variant} text={variant}
                style={{borderRadius: "5px"}}>
            <Card.Header>
              <a href={track["track_url"]}>{track["title"]}</a>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                by <a href={track["author_url"]}>{track["author"]}</a>
              </Card.Text>
              <Card.Text>
                Available under a creative commons licese
              </Card.Text>
              <a href={track["license_url"]}><img src={track["license_img"]} alt="CC license" /></a>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <SimplePage {...props} account={account} setAccount={setAccount}>
      <Container fluid>
        <h1 style={{textAlign:"center"}}>Music Played During SeptembRSE</h1>
        {t}
        <Row key="submit_your_music">
          <Col style={{marginTop:"10px",
                       maxWidth: "768px",
                       marginLeft: "auto", marginRight: "auto"}}>
            Do you want to share your music with the audience of SeptembRSE?
            If so, please <a href="mailto:conference-2021@society-rse.org">let us know!</a> Music
            must be creative commons licensed and be predominantly instrumental.
            We are looking for music that matches the chip music / 8 bit theme of the conference.
          </Col>
        </Row>
      </Container>
    </SimplePage>
  );
}
