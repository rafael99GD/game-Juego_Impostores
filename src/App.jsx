import React, { useState, useEffect } from 'react';
import { Users, Plus, X, Edit2, Trash2, Play, ArrowRight, RotateCcw, BookOpen, Sparkles, List } from 'lucide-react';

export default function ImpostorGame() {
  const [screen, setScreen] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [words, setWords] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [newWord, setNewWord] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingWord, setEditingWord] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [numImpostors, setNumImpostors] = useState(1);
  const [showTransition, setShowTransition] = useState(false);
  
  // Nuevo: Modo de juego y temas
  const [gameMode, setGameMode] = useState('custom'); // 'custom' o 'themes'
  const [availableThemes, setAvailableThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [themeWords, setThemeWords] = useState([]);
  const BASE_URL = import.meta.env.BASE_URL;

  // Cargar temas disponibles al montar el componente
  useEffect(() => {
    loadAvailableThemes();
  }, []);

  const loadAvailableThemes = async () => {
    try {
      // Leer el archivo index.json que contiene la lista de temas
      const response = await fetch(`${import.meta.env.BASE_URL}temas/index.json`);
      if (response.ok) {
        const data = await response.json();
        setAvailableThemes(data.temas || []);
      } else {
        console.error('No se pudo cargar index.json');
        setAvailableThemes([]);
      }
    } catch (error) {
      console.error('Error al cargar los temas:', error);
      setAvailableThemes([]);
    }
  };

  const formatThemeName = (filename) => {
    // Quitar la extensión .txt
    let name = filename.replace('.txt', '');
    // Reemplazar guiones bajos por espacios
    name = name.replace(/_/g, ' ');
    return name;
  };

  const loadThemeWords = async (themeName) => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}temas/${themeName}`);
      if (response.ok) {
        const text = await response.text();
        // Dividir por líneas y filtrar líneas vacías
        const wordsList = text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        setThemeWords(wordsList);
        setSelectedTheme(themeName);
      }
    } catch (error) {
      alert('Error al cargar el tema. Asegúrate de que el archivo existe.');
    }
  };

  const addPlayer = () => {
    if (newPlayer.trim()) {
      setPlayers([...players, { id: Date.now(), name: newPlayer.trim() }]);
      setNewPlayer('');
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
    const maxImpostors = Math.max(1, Math.floor((players.length - 1) / 2));
    if (numImpostors > maxImpostors) {
      setNumImpostors(maxImpostors);
    }
  };

  const updatePlayer = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
    setEditingPlayer(null);
  };

  const addWord = () => {
    if (newWord.trim()) {
      setWords([...words, { id: Date.now(), word: newWord.trim() }]);
      setNewWord('');
    }
  };

  const removeWord = (id) => {
    setWords(words.filter(w => w.id !== id));
  };

  const updateWord = (id, newWordText) => {
    setWords(words.map(w => w.id === id ? { ...w, word: newWordText } : w));
    setEditingWord(null);
  };

  const startGame = () => {
    if (players.length < 3) {
      alert('Necesitas al menos 3 jugadores para jugar');
      return;
    }

    let wordToUse;

    if (gameMode === 'themes') {
      if (themeWords.length === 0) {
        alert('Por favor selecciona un tema primero');
        return;
      }
      wordToUse = themeWords[Math.floor(Math.random() * themeWords.length)];
    } else {
      if (words.length === 0) {
        alert('Necesitas al menos 1 palabra para jugar');
        return;
      }
      wordToUse = words[Math.floor(Math.random() * words.length)].word;
    }
    
    if (numImpostors >= players.length) {
      alert('El número de impostores debe ser menor que el número de jugadores');
      return;
    }

    const shuffledPlayers = [...players];
    
    const impositorIndices = new Set();
    while (impositorIndices.size < numImpostors) {
      impositorIndices.add(Math.floor(Math.random() * shuffledPlayers.length));
    }

    const playersWithRoles = shuffledPlayers.map((player, idx) => ({
      ...player,
      isImpostor: impositorIndices.has(idx),
      word: impositorIndices.has(idx) ? null : wordToUse
    }));

    setGameData({ players: playersWithRoles, word: wordToUse });
    setCurrentPlayerIndex(0);
    setIsCardFlipped(false);
    setScreen('game');
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < gameData.players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setIsCardFlipped(false);
    } else {
      setShowTransition(true);
      setIsCardFlipped(false);
    }
  };

  const showResults = () => {
    setScreen('end');
    setShowTransition(false);
  };

  const resetGame = () => {
    setScreen('setup');
    setCurrentPlayerIndex(0);
    setIsCardFlipped(false);
    setGameData(null);
    setShowTransition(false);
  };

  const currentPlayer = gameData?.players[currentPlayerIndex];

  const maxImpostors = Math.max(1, Math.floor(players.length / 2));
  const impositorOptions = Array.from({ length: maxImpostors }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-4 pb-16 flex items-center justify-center relative">
      <div className="fixed bottom-4 right-4 text-white/70 text-sm font-medium z-50 pointer-events-none">
        By rafael99
      </div>

      <div className="w-full max-w-2xl">
        {screen === 'setup' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                Juego Impostores
              </h1>
              <p className="text-gray-600">Configura tu partida</p>
            </div>

            {/* Players Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">Jugadores ({players.length})</h2>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPlayer}
                  onChange={(e) => setNewPlayer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Nombre del jugador"
                  className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={addPlayer}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl">
                    {editingPlayer === player.id ? (
                      <input
                        type="text"
                        defaultValue={player.name}
                        onBlur={(e) => updatePlayer(player.id, e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && updatePlayer(player.id, e.target.value)}
                        className="flex-1 px-2 py-1 border border-purple-300 rounded"
                        autoFocus
                      />
                    ) : (
                      <span className="flex-1 font-medium text-gray-800">{player.name}</span>
                    )}
                    <button onClick={() => setEditingPlayer(player.id)} className="text-purple-600 hover:text-purple-800">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => removePlayer(player.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modo de Juego */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Modo de Juego</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setGameMode('custom')}
                  className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                    gameMode === 'custom'
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <List className="mx-auto mb-2" size={32} />
                  <p className="font-bold">Personalizado</p>
                </button>
                <button
                  onClick={() => setGameMode('themes')}
                  className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                    gameMode === 'themes'
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="mx-auto mb-2" size={32} />
                  <p className="font-bold">Por Temas</p>
                </button>
              </div>
            </div>

            {/* Sección de Temas */}
            {gameMode === 'themes' && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-pink-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Selecciona un Tema</h2>
                </div>
                
                {availableThemes.length === 0 ? (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                    <p className="text-yellow-800 font-medium">
                      No se encontraron temas. Asegúrate de crear archivos .txt en la carpeta /public/temas/
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableThemes.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => loadThemeWords(theme)}
                        className={`p-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                          selectedTheme === theme
                            ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-lg'
                            : 'bg-pink-50 text-pink-900 hover:bg-pink-100'
                        }`}
                      >
                        {formatThemeName(theme)}
                      </button>
                    ))}
                  </div>
                )}
                
                {selectedTheme && (
                  <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <p className="text-green-800 font-medium text-center">
                      ✓ Tema seleccionado: <span className="font-bold">{formatThemeName(selectedTheme)}</span> ({themeWords.length} palabras)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Sección de Palabras Personalizadas */}
            {gameMode === 'custom' && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="text-pink-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Palabras ({words.length})</h2>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addWord()}
                    placeholder="Nueva palabra"
                    className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <button
                    onClick={addWord}
                    className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {words.map((word) => (
                    <div key={word.id} className="flex items-center gap-2 bg-pink-50 p-3 rounded-xl">
                      {editingWord === word.id ? (
                        <input
                          type="text"
                          defaultValue={word.word}
                          onBlur={(e) => updateWord(word.id, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && updateWord(word.id, e.target.value)}
                          className="flex-1 px-2 py-1 border border-pink-300 rounded"
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1 font-medium text-gray-800">{word.word}</span>
                      )}
                      <button onClick={() => setEditingWord(word.id)} className="text-pink-600 hover:text-pink-800">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => removeWord(word.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Number of Impostors */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Número de impostores: {numImpostors}
              </h2>
              <div className="flex flex-wrap gap-2">
                {impositorOptions.map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumImpostors(num)}
                    className={`flex-1 min-w-[60px] py-3 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                      numImpostors === num
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {players.length < 3 && (
                <p className="text-sm text-gray-500 mt-2">
                  Añade al menos 3 jugadores para seleccionar impostores
                </p>
              )}
            </div>

            <button
              onClick={startGame}
              disabled={players.length < 3 || (gameMode === 'custom' && words.length === 0) || (gameMode === 'themes' && themeWords.length === 0)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play size={24} />
              Iniciar Juego
            </button>
          </div>
        )}

        {screen === 'game' && currentPlayer && !showTransition && (
          <div className="relative h-[600px] perspective-1000">
            {!isCardFlipped ? (
              <div className="absolute inset-0 flex items-center justify-center animate-fadeIn">
                <div className="bg-white rounded-3xl shadow-2xl p-12 text-center w-full max-w-md">
                  <div className="mb-8">
                    <div className="text-6xl mb-4">👤</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Turno de:</h2>
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {currentPlayer.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCardFlipped(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                  >
                    Ver mi rol
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center animate-slideUp">
                <div className={`rounded-3xl shadow-2xl p-12 text-center w-full max-w-md ${
                  currentPlayer.isImpostor 
                    ? 'bg-gradient-to-br from-red-600 to-red-800' 
                    : 'bg-gradient-to-br from-green-500 to-green-700'
                }`}>
                  <div className="mb-8">
                    <div className="text-6xl mb-4">
                      {currentPlayer.isImpostor ? '🎭' : '✅'}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {currentPlayer.isImpostor ? '¡IMPOSTOR!' : '¡JUGADOR!'}
                    </h2>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <p className="text-2xl font-bold text-white">
                        {currentPlayer.isImpostor ? 'Descubre la palabra secreta' : currentPlayer.word}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={nextPlayer}
                    className="w-full bg-white text-gray-800 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Siguiente Jugador <ArrowRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {screen === 'game' && showTransition && (
          <div className="relative h-[600px] flex items-center justify-center animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center w-full max-w-md">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
                ¡Todos han visto sus roles!
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Ahora puedes ver el resumen de la partida
              </p>
              <button
                onClick={showResults}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Ver Roles <ArrowRight size={24} />
              </button>
            </div>
          </div>
        )}

        {screen === 'end' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              ¡Todos han visto sus roles!
            </h1>
            <p className="text-xl text-gray-600 mb-2">La palabra era:</p>
            <p className="text-3xl font-bold text-purple-600 mb-8">{gameData.word}</p>
            
            <div className="mb-8 bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Resumen:</h3>
              <div className="space-y-2">
                {gameData.players.map((player, idx) => (
                  <div key={idx} className={`p-3 rounded-xl ${
                    player.isImpostor ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <span className="font-medium">{player.name}</span>
                    <span className="ml-2">{player.isImpostor ? '🎭 Impostor' : '✅ Jugador'}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RotateCcw size={24} />
              Nueva Partida
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}