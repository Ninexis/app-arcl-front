import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CookieClicker.css';

interface GameData {
  cookieCount: number;
  totalCookiesProduced: number;
  autoClickerCount: number;
  autoClickerPrice: number;
  buildingCount: number;
  buildingPrice: number;
}

interface Cloud {
  id: number;
  left: number;
  top: number;
}

interface Raindrop {
  id: number;
  left: number;
}

const CookieClicker: React.FC = () => {
  const [data, setData] = useState<GameData>({
    cookieCount: 0,
    totalCookiesProduced: 0,
    autoClickerCount: 0,
    autoClickerPrice: 0,
    buildingCount: 0,
    buildingPrice: 0,
  });

  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);
  const [waterLevel, setWaterLevel] = useState(0);
  const [lightning, setLightning] = useState(false);
  const [raining, setRaining] = useState(false);

  const fetchGameData = async () => {
    try {
      const res = await axios.get<GameData>('http://localhost:5000/home/load_game_data');
      setData(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
  };

  const saveGameData = async () => {
    try {
      await axios.post('http://localhost:5000/home/save_game_data', {
        cookieCount: data.cookieCount,
        totalCookiesProduced: data.totalCookiesProduced,
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error);
    }
  };

  const buyBuilding = async (building_id: number) => {
    try {
      await axios.post('http://localhost:5000/home/buy_building', { building_id });
      fetchGameData();
    } catch (error) {
      console.error('Erreur achat bâtiment', error);
    }
  };

  const deleteBuilding = async (building_id: number) => {
    try {
      await axios.post('http://localhost:5000/home/delete_building', { building_id });
      fetchGameData();
    } catch (error) {
      console.error('Erreur suppression bâtiment', error);
    }
  };

  const clickCloud = () => {
    setData(prev => ({
      ...prev,
      cookieCount: prev.cookieCount + 1,
      totalCookiesProduced: prev.totalCookiesProduced + 1,
    }));

    // nouveau nuage avec position verticale random
    setClouds(prev => [
      ...prev,
      {
        id: Date.now(),
        left: 100,
        top: Math.random() * 40, // haut de la page (0-40%)
      }
    ]);

    setRaining(true);

    setTimeout(() => {
      setRaining(false);
    }, 3000);

    setWaterLevel(prev => Math.min(prev + 0.2, 100));

    if (Math.random() < 0.05) {
      setLightning(true);
      setTimeout(() => setLightning(false), 500);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  // Déplacement des nuages vers la gauche
  useEffect(() => {
    const interval = setInterval(() => {
      setClouds(prev => prev
          .map(cloud => ({ ...cloud, left: cloud.left - 0.5 }))
          .filter(cloud => cloud.left > -10) // supprime s'il est sorti de l'écran
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Générer des gouttes quand il pleut
  useEffect(() => {
    if (!raining) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const newDrops = Array.from({ length: 10 }, () => ({
        id: now + Math.random(),
        left: Math.random() * 100,
      }));
      setRaindrops(prev => [...prev, ...newDrops]);
    }, 200);

    return () => clearInterval(interval);
  }, [raining]);

  // Nettoyer les gouttes de pluie après 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      const expirationTime = Date.now() - 4000;
      setRaindrops(prev => prev.filter(drop => drop.id > expirationTime));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
      <>
        {lightning && <div className="lightning-flash"></div>}
        <div className="water" style={{ height: `${waterLevel}vh` }} />

        {raindrops.map((drop) => (
            <div
                key={drop.id}
                className="raindrop"
                style={{ left: `${drop.left}%` }}
            />
        ))}

        {clouds.map((cloud) => (
            <img
                key={cloud.id}
                src="/cloud.png"
                alt="cloud"
                className="floating-cloud"
                style={{ left: `${cloud.left}%`, top: `${cloud.top}%` }}
            />
        ))}

        <div className="interface">
          <div className="cloud-container" onClick={clickCloud}>
            <div className="total-count">Total ☁️ {data.totalCookiesProduced} ☁️</div>
            <img
                src="/cloud.png"
                alt="Cloud Cookie"
                className="cloud-image"
            />
            <div className="current-count">Current ☁️ {data.cookieCount}</div>
          </div>

          <div className="cards">
            <div className="card">
              <h2>Auto-Clicker</h2>
              <p>Quantité: {data.autoClickerCount}</p>
              <p>Prix: {data.autoClickerPrice} ☁️</p>
              <button onClick={() => buyBuilding(1)}>Acheter</button>
              <button className="delete" onClick={() => deleteBuilding(1)}>Supprimer</button>
            </div>

            <div className="card">
              <h2>Bâtiment</h2>
              <p>Quantité: {data.buildingCount}</p>
              <p>Prix: {data.buildingPrice} ☁️</p>
              <button onClick={() => buyBuilding(2)}>Acheter</button>
              <button className="delete" onClick={() => deleteBuilding(2)}>Supprimer</button>
            </div>
          </div>

          <button className="save-button" onClick={saveGameData}>
            💾 Sauvegarder
          </button>
        </div>
      </>
  );
};

export default CookieClicker;
