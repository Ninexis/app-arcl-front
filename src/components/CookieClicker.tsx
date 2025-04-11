import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface GameData {
  cookieCount: number;
  totalCookiesProduced: number;
  autoClickerCount: number;
  autoClickerPrice: number;
  buildingCount: number;
  buildingPrice: number;
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

  const clickCookie = () => {
    setData(prev => ({
      ...prev,
      cookieCount: prev.cookieCount + 1,
      totalCookiesProduced: prev.totalCookiesProduced + 1,
    }));
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  return (
    <div>
      <h1>🍪 Cookie Clicker</h1>
      <p>Cookies: {data.cookieCount}</p>
      <p>Total produits: {data.totalCookiesProduced}</p>
      <button onClick={clickCookie}>Cliquer le cookie</button>
      <br /><br />
      <h2>Bâtiments</h2>
      <div>
        <p>Auto-clickers: {data.autoClickerCount} (Prix: {data.autoClickerPrice})</p>
        <button onClick={() => buyBuilding(1)}>Acheter auto-clicker</button>
        <button onClick={() => deleteBuilding(1)}>Supprimer auto-clicker</button>
      </div>
      <div>
        <p>Bâtiments: {data.buildingCount} (Prix: {data.buildingPrice})</p>
        <button onClick={() => buyBuilding(2)}>Acheter bâtiment</button>
        <button onClick={() => deleteBuilding(2)}>Supprimer bâtiment</button>
      </div>
      <br />
      <button onClick={saveGameData}>💾 Sauvegarder</button>
    </div>
  );
};

export default CookieClicker;
