import React from 'react'

export default function restartGame({onNewGame = () => {}, touches}) {
    return (  
    <div className="modal">
        <div className="container">
            <h2>Parabéns!</h2>
            <p>Você concluiu em {touches} toques.</p>

            <button onClick={onNewGame}>De novo?</button>
        </div>
    </div>
    )
}