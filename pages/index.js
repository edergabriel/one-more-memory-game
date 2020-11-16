import Head from 'next/head'
import React, { useState } from 'react';
import RestartGame from '../components/restartGame'


let chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', '1', '2', '3', '#', '&', '?', '!', '%', 'W'];
let removeChars = []
let numberSelectChars = 0;
let openCard = false;
let validClick = 0; 
let positions;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkValue(number) {
  for (var i = 0; i < removeChars.length; i++) {      
    if (removeChars[i] === number) {
        number = checkValue(getRandomInt(0, chars.length -1))
        break;      
    }
  }
  return number
}

function createPositions(number) {
  let positions = []

  for (var i = 0; i < number; i++) {
    let typeChar = i;
    let selectedChar;
    if(i%2 === 0) {
      numberSelectChars = checkValue(getRandomInt(0, chars.length -1));
    } else {
      typeChar = i - 1;
      removeChars.push(numberSelectChars)
    }
    selectedChar = chars[numberSelectChars];
    positions.push({ id: i, type: typeChar, title: selectedChar});
  }
  return positions;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

function newGame() {
  removeChars = []
  numberSelectChars = 0;
  openCard = false;
  validClick = 0; 
  positions = createPositions(30);
  console.log(positions) 
 // positions = shuffleArray(positions);
}

newGame();

export default function Home() {

  const [numberTouches, setNumberTouches] = useState(0);
  const [record, setRecord] = useState(9999);
  const [finishGame, setFinishGame] = useState(false);
  const [flgRecord, setFlgRecord] = useState(false);

  function handleClick(e) {
    e.preventDefault();

    if(validClick < 2 && e.currentTarget.classList.value.indexOf('finded') < 0) {
      setNumberTouches(numberTouches + 1);
      validClick = validClick + 1;
      e.currentTarget.classList.toggle('is-flipped');
      
      if(!openCard) {
        openCard = true;
      } else {
        let element = document.querySelectorAll('.card.is-flipped:not(.finded)');
        let nodeSelected = 0;
        setTimeout(function() {
          Array.prototype.forEach.call( element, function( node ) {
            if(nodeSelected === 0) {
              nodeSelected = node
            } else {
              console.log(node, nodeSelected)
              if(node.dataset.type !== nodeSelected.dataset.type) {
                node.classList.remove('is-flipped')
                nodeSelected.classList.remove('is-flipped')
              } else {
                node.classList.add('finded')
                nodeSelected.classList.add('finded')
                if(document.querySelectorAll('.card.finded').length >= document.querySelectorAll('.card').length) {
                  setFinishGame(true)
                  setFlgRecord(true)
                  console.log(numberTouches, record);
                  if(numberTouches < record) {
                    setRecord(numberTouches + 1);
                  }
                }
              }
              nodeSelected = 0
            }
          });
          openCard = false;
          validClick = 0;
        }, 1000)
      }
    }
  }

  function onNewGame() {
    document.querySelector('.cards').classList.add('none')
    for(var i = 0; i < document.querySelectorAll('.card').length; i++ ) {
      document.querySelectorAll('.card')[i].classList.remove('finded')
      document.querySelectorAll('.card')[i].classList.remove('is-flipped')
    }
    newGame();
    setFinishGame(false);
    setNumberTouches(0);
    setTimeout(function() {
      document.querySelector('.cards').classList.remove('none')
    }, 1000)
  }

  return (
    <div>
      <Head>
        <title>Jogo da Memória</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <aside>
          <h1>Jogo da Memória</h1>
          <p>Uma versão do famoso jogo da memória.</p>
        </aside>
        <div className="cards">
          {positions.map(position => (
            <button className="card" href="#" onClick={handleClick} data-type={position.type} key={position.id}>
              <div className="card__face card__face--front">{position.title}</div>
              <div className="card__face card__face--back"><div></div></div>
            </button>
          ))}
        </div>
        {finishGame ? <RestartGame  onNewGame={() => onNewGame() } touches={numberTouches} /> : null }
        <div className="hud">
          <div>
            <span>{numberTouches}</span> {numberTouches >= 2 ? "touches" : "touch" }
          </div>
          { flgRecord ? <div><span>{ record }</span> your record</div> : null }
        </div> 
      </main>



    </div>
  )
}
