
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
  },
  {
    url: "https://siremol.org/largefiles/music/005.mp3",
    title: "Tuffet",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/the-happy-puppy-collection/tuffet",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/006.mp3",
    title: "Sunny Morning Exercise Club",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/the-happy-puppy-collection/sunny-morning-exercise-club",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/007.mp3",
    title: "Medicine Head",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/the-happy-puppy-collection/medicine-head",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/008.mp3",
    title: "Making up for Lost Time",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/the-happy-puppy-collection/making-up-for-lost-time",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/009.mp3",
    title: "Kind Gentle Beautiful Person",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/the-happy-puppy-collection/kind-gentle-beautiful-person",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/010.mp3",
    title: "4c Iced Tea",
    author: "Origami Repetika",
    track_url: "https://freemusicarchive.org/music/Origami_Repetika/the-happy-puppy-collection/4c-iced-tea",
    author_url: "https://freemusicarchive.org/music/Origami_Repetika",
    license_img: "https://licensebuttons.net/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    url: "https://siremol.org/largefiles/music/011.mp3",
    title: "Tricky Pyramids",
    author: "Edward Shallow",
    track_url: "https://freemusicarchive.org/music/Edward_Shallow/Hippodichotomous/04_Tricky_Pyramids",
    author_url: "https://freemusicarchive.org/music/Edward_Shallow",
    license_img: "https://creativecommons.org/images/deed/nc_white_x2.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/012.mp3",
    title: "The Infinite Railroad",
    author: "Edward Shallow",
    track_url: "https://freemusicarchive.org/music/Edward_Shallow/Hippodichotomous/01_The_Infinite_Railroad",
    author_url: "https://freemusicarchive.org/music/Edward_Shallow",
    license_img: "https://creativecommons.org/images/deed/nc_white_x2.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/013.mp3",
    title: "Fractal Crook",
    author: "Edward Shallow",
    track_url: "https://freemusicarchive.org/music/Edward_Shallow/Hippodichotomous/02_Fractal_Crook",
    author_url: "https://freemusicarchive.org/music/Edward_Shallow",
    license_img: "https://creativecommons.org/images/deed/nc_white_x2.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/014.mp3",
    title: "Cauldron Chemistry",
    author: "Edward Shallow",
    track_url: "https://freemusicarchive.org/music/Edward_Shallow/Hippodichotomous/03_Cauldron_Chemistry",
    author_url: "https://freemusicarchive.org/music/Edward_Shallow",
    license_img: "https://creativecommons.org/images/deed/nc_white_x2.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/015.mp3",
    title: "Love Crime",
    author: "Goto80",
    track_url: "https://freemusicarchive.org/music/Goto80/Updown/Love_Crime",
    author_url: "https://freemusicarchive.org/music/Goto80",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/3.0/us/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/016.mp3",
    title: "Law of Cosines",
    author: "Alex Mauer",
    track_url: "https://freemusicarchive.org/music/Alex_Mauer/Vegavox_2/Law_of_Cosines",
    author_url: "https://freemusicarchive.org/music/Alex_Mauer",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/us/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/017.mp3",
    title: "The Staff",
    author: "Multifaros",
    track_url: "https://freemusicarchive.org/music/Multifaros/The_Factory/The_Staff",
    author_url: "https://freemusicarchive.org/music/Multifaros",
    license_img: "https://i.creativecommons.org/l/by/3.0/us/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/018.mp3",
    title: "Gianna",
    author: "Factor6",
    track_url: "https://freemusicarchive.org/music/Factor6/ZX_Spectrum_is_Alive/Gianna",
    author_url: "https://freemusicarchive.org/music/Factor6",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/019.mp3",
    title: "Humbuk",
    author: "X-agon",
    track_url: "https://freemusicarchive.org/music/X-agon/ZX_Spectrum_is_Alive/Humbuk",
    author_url: "https://freemusicarchive.org/music/X-agon",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/020.mp3",
    title: "Norwegian Blue",
    author: "Gasman",
    track_url: "https://freemusicarchive.org/music/Gasman/ZX_Spectrum_is_Alive/Norwegian_Blue",
    author_url: "https://freemusicarchive.org/music/Gasman",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/021.mp3",
    title: "Cloud 9",
    author: "Factor6",
    track_url: "https://freemusicarchive.org/music/Factor6/ZX_Spectrum_is_Alive/Cloud_9",
    author_url: "https://freemusicarchive.org/music/Factor6",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/022.mp3",
    title: "Demo-5",
    author: "Utabi",
    track_url: "https://freemusicarchive.org/music/Utabi/FM_Ongen_Super_Maniacs/11_Demo-5",
    author_url: "https://freemusicarchive.org/music/Utabi",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/2.1/jp/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/2.1/jp/"
  },
  {
    url: "https://siremol.org/largefiles/music/023.mp3",
    title: "BullCactus",
    author: "Goto80",
    track_url: "https://freemusicarchive.org/music/Goto80/Digi-Dig/04_-_Bullcactus",
    author_url: "https://freemusicarchive.org/music/Goto80",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/2.0/fr/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/2.0/fr/"
  },
  {
    url: "https://siremol.org/largefiles/music/024.mp3",
    title: "Otosclerosis",
    author: "Binärpilot",
    track_url: "https://freemusicarchive.org/music/Binrpilot/Remember_C64/Otosclerosis",
    author_url: "https://freemusicarchive.org/music/Binrpilot",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/3.0/us/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/025.mp3",
    title: "Tjaerlighet",
    author: "Binärpilot",
    track_url: "https://freemusicarchive.org/music/Binrpilot/Remember_C64/Tjaerlighet",
    author_url: "https://freemusicarchive.org/music/Binrpilot",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/3.0/us/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/026.mp3",
    title: "Before the Storm",
    author: "Kenobit",
    track_url: "https://freemusicarchive.org/music/Kenobit/The_Square_Wave_Conspiracy/06_Kenobit_-_Before_The_Storm",
    author_url: "https://freemusicarchive.org/music/Kenobit",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/027.mp3",
    title: "superpila",
    author: "Rabato",
    track_url: "https://freemusicarchive.org/music/Rabato/Chorson_Dival/m3d046_05_rabato_superpila",
    author_url: "https://freemusicarchive.org/music/Rabato",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/028.mp3",
    title: "Terraforming Mars",
    author: "Alex Mauer",
    track_url: "https://freemusicarchive.org/music/Alex_Mauer/Magnetic_Sumo/02_Alex_Mauer_-_Terraforming_Mars",
    author_url: "https://freemusicarchive.org/music/Alex_Mauer",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/3.0/us/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/029.mp3",
    title: "Intergalactic Disko Dance Party",
    author: "Wizwars",
    track_url: "https://freemusicarchive.org/music/Wizwars/Game_Boy_Rock/03_Intergalactic_Disko_Dance_Party",
    author_url: "https://freemusicarchive.org/music/Wizwars",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/3.0/us/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/030.mp3",
    title: "The Information Chase",
    author: "Bit Shifter",
    track_url: "https://freemusicarchive.org/music/bit_shifter/Information_Chase/8bp059-06-bit_shifter-the_information_chase",
    author_url: "https://freemusicarchive.org/music/bit_shifter",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/031.mp3",
    title: "Activation Theme",
    author: "Bit Shifter",
    track_url: "https://freemusicarchive.org/music/bit_shifter/Information_Chase/8bp059-02-bit_shifter-activation_theme",
    author_url: "https://freemusicarchive.org/music/bit_shifter",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/032.mp3",
    title: "Hexadecimal Genome",
    author: "Bit Shifter",
    track_url: "https://freemusicarchive.org/music/bit_shifter/Information_Chase/8bp059-03-bit_shifter-hexadecimal_genome",
    author_url: "https://freemusicarchive.org/music/bit_shifter",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/033.mp3",
    title: "Particle Charge",
    author: "Bit Shifter",
    track_url: "https://freemusicarchive.org/music/bit_shifter/Information_Chase/8bp059-04-bit_shifter-particle_charge",
    author_url: "https://freemusicarchive.org/music/bit_shifter",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/034.mp3",
    title: "Reformat The Planet",
    author: "Bit Shifter",
    track_url: "https://freemusicarchive.org/music/bit_shifter/Information_Chase/8bp059-05-bit_shifter-reformat_the_planet",
    author_url: "https://freemusicarchive.org/music/bit_shifter",
    license_img: "https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-nd/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/035.mp3",
    title: "Beach Biscuit",
    author: "µB",
    track_url: "https://freemusicarchive.org/music/B/Mario_in_an_Elevator/B-BeachBiscuit",
    author_url: "https://freemusicarchive.org/music/B",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/3.0/us/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/3.0/us/"
  },
  {
    url: "https://siremol.org/largefiles/music/036.mp3",
    title: "Another beek beep beer please",
    author: "Rolemusic",
    track_url: "https://freemusicarchive.org/music/Rolemusic/gigs_n_contest/rolemusic_-_gigs_n_contest_-_03_Another_beek_beep_beer_please",
    author_url: "https://freemusicarchive.org/music/Rolemusic",
    license_img: "https://i.creativecommons.org/l/by/3.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/3.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/037.mp3",
    title: "Python",
    author: "Rolemusic",
    track_url: "https://freemusicarchive.org/music/Rolemusic/Pop_Singles_Compilation_2014/03_rolemusic_-_python",
    author_url: "https://freemusicarchive.org/music/Rolemusic",
    license_img: "https://i.creativecommons.org/l/by/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/038.mp3",
    title: "Wizard House",
    author: "Azureflex",
    track_url: "https://freemusicarchive.org/music/Azureflux/Mean_Machine/01_azureflux_-_wizard_house",
    author_url: "https://freemusicarchive.org/music/Azureflux",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/039.mp3",
    title: "Popcorn Blast",
    author: "Azureflex",
    track_url: "https://freemusicarchive.org/music/Azureflux/Piko_Piko_Stereo/02_azureflux_-_popcorn_blast",
    author_url: "https://freemusicarchive.org/music/Azureflux",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/040.mp3",
    title: "Eat My Chips",
    author: "Azureflex",
    track_url: "https://freemusicarchive.org/music/Azureflux/Piko_Piko_Stereo/04_azureflux_-_eat_my_chips",
    author_url: "https://freemusicarchive.org/music/Azureflux",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/041.mp3",
    title: "Catnip",
    author: "Azureflex",
    track_url: "https://freemusicarchive.org/music/Azureflux/Piko_Piko_Stereo/06_azureflux_-_catnip",
    author_url: "https://freemusicarchive.org/music/Azureflux",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/042.mp3",
    title: "Bipolar Bear",
    author: "Azureflex",
    track_url: "https://freemusicarchive.org/music/Azureflux/Bipolar_Bear/01_azureflux_-_bipolar_bear",
    author_url: "https://freemusicarchive.org/music/Azureflux",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  },
  {
    url: "https://siremol.org/largefiles/music/043.mp3",
    title: "Clocks",
    author: "Gonzalo Varela",
    track_url: "https://freemusicarchive.org/music/Gonzalo_Varela/Dreamnesia/Gonzalo_Varela_-_Dreamnesia_-_04_Clocks",
    author_url: "https://freemusicarchive.org/music/Gonzalo_Varela",
    license_img: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
    license_url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
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
                bg={variant}
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
